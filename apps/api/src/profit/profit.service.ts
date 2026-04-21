import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function toNumberOrString(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  return value;
}

function serializeProfitLedger(r: Record<string, unknown>) {
  return {
    ...r,
    tokenCostAmount: toNumberOrString(r.tokenCostAmount) as number | null,
    toolCostAmount: toNumberOrString(r.toolCostAmount) as number | null,
    laborCostAmount: toNumberOrString(r.laborCostAmount) as number | null,
    otherCostAmount: toNumberOrString(r.otherCostAmount) as number | null,
    revenueAmount: toNumberOrString(r.revenueAmount) as number | null,
    grossProfitAmount: toNumberOrString(r.grossProfitAmount) as number | null,
    grossMargin: toNumberOrString(r.grossMargin) as number | null,
  };
}

@Injectable()
export class ProfitService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectProfit(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    let ledger = await this.prisma.profitLedger.findFirst({
      where: { projectId, periodType: 'project_total' },
      orderBy: { calculatedAt: 'desc' },
    });

    if (!ledger) {
      return await this.recalculateProjectProfit(projectId);
    }

    return serializeProfitLedger(ledger as Record<string, unknown>);
  }

  async recalculateProjectProfit(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { scopeVersions: true },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const usageRecords = await this.prisma.usageRecord.findMany({
      where: { projectId, status: 'consumed' },
    });

    let tokenCostAmount = new Decimal(0);
    let toolCostAmount = new Decimal(0);
    let otherCostAmount = new Decimal(0);

    for (const record of usageRecords) {
      const cost = record.costAmount ?? new Decimal(0);
      if (record.usageType === 'token_call' || record.usageType === 'model_use') {
        tokenCostAmount = tokenCostAmount.add(cost);
      } else if (record.usageType === 'tool_run') {
        toolCostAmount = toolCostAmount.add(cost);
      } else if (record.usageType === 'manual_adjustment') {
        otherCostAmount = otherCostAmount.add(cost);
      }
    }

    const frozenScope = project.scopeVersions.find((s) => s.status === 'frozen');
    const revenueAmount = frozenScope?.quotedAmount
      ? new Decimal(frozenScope.quotedAmount.toString())
      : project.budgetAmount
        ? new Decimal(project.budgetAmount.toString())
        : new Decimal(0);

    const laborCostAmount = new Decimal(0);

    const grossProfitAmount = revenueAmount.sub(
      tokenCostAmount.add(toolCostAmount).add(laborCostAmount).add(otherCostAmount),
    );

    const grossMargin = revenueAmount.greaterThan(0)
      ? grossProfitAmount.div(revenueAmount).mul(100)
      : new Decimal(0);

    try {
      const ledger = await this.prisma.profitLedger.upsert({
        where: {
          projectId_periodType: {
            projectId,
            periodType: 'project_total',
          },
        },
        update: {
          tokenCostAmount,
          toolCostAmount,
          laborCostAmount,
          otherCostAmount,
          revenueAmount,
          grossProfitAmount,
          grossMargin,
          calculatedAt: new Date(),
        },
        create: {
          projectId,
          periodType: 'project_total',
          tokenCostAmount,
          toolCostAmount,
          laborCostAmount,
          otherCostAmount,
          revenueAmount,
          grossProfitAmount,
          grossMargin,
          calculatedAt: new Date(),
        },
      });

      return serializeProfitLedger(ledger as Record<string, unknown>);
    } catch (error) {
      throw new InternalServerErrorException(
        'PROFIT_RECALCULATION_FAILED',
        '利润重算失败',
      );
    }
  }

  async getParkOverview() {
    const totalIssued = await this.prisma.entitlementGrant.aggregate({
      _sum: { quantityTotal: true },
    });
    const totalIssuedAmount = totalIssued._sum.quantityTotal
      ? (totalIssued._sum.quantityTotal as Decimal).toNumber()
      : 0;

    const activeTeams = await this.prisma.organization.count({
      where: { type: 'opc_team', status: 'active' },
    });

    const consumed = await this.prisma.usageRecord.aggregate({
      where: { status: 'consumed' },
      _sum: { quantityUsed: true },
    });
    const consumedAmount = consumed._sum.quantityUsed
      ? (consumed._sum.quantityUsed as Decimal).toNumber()
      : 0;

    const verificationRate =
      totalIssuedAmount > 0
        ? Math.round((consumedAmount / totalIssuedAmount) * 10000) / 100
        : 0;

    return {
      totalIssuedAmount,
      activeTeams,
      verificationRate,
      currentMonthSubsidy: 87500,
    };
  }

  async getUsageRoi() {
    const now = new Date();
    const startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    const records = await this.prisma.usageRecord.findMany({
      where: {
        status: 'consumed',
        occurredAt: { gte: startDate },
      },
      select: {
        occurredAt: true,
        quantityUsed: true,
        costAmount: true,
      },
      orderBy: { occurredAt: 'asc' },
    });

    const map = new Map<string, { date: string; quantityUsed: number; costAmount: number }>();
    for (const r of records) {
      const date = r.occurredAt.toISOString().split('T')[0];
      const existing = map.get(date) ?? { date, quantityUsed: 0, costAmount: 0 };
      existing.quantityUsed += (r.quantityUsed as Decimal).toNumber();
      existing.costAmount += r.costAmount ? (r.costAmount as Decimal).toNumber() : 0;
      map.set(date, existing);
    }

    const result: { date: string; quantityUsed: number; costAmount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const date = d.toISOString().split('T')[0];
      result.push(map.get(date) ?? { date, quantityUsed: 0, costAmount: 0 });
    }
    return result;
  }

  getSettlements() {
    return {
      pendingCount: 3,
      pendingAmount: 245000,
      settledCount: 12,
      settledAmount: 980000,
      disputes: [
        { id: 'dispute-1', amount: 5000, reason: '发票信息不一致', status: 'open' },
        { id: 'dispute-2', amount: 12000, reason: '服务时长争议', status: 'open' },
      ],
    };
  }
}
