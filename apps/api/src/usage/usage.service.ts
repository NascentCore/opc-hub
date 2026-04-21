import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UsageType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

function toNumberOrString(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  return value;
}

function serializeUsageRecord(r: Record<string, unknown>) {
  return {
    ...r,
    quantityUsed: toNumberOrString(r.quantityUsed) as number,
    costAmount: toNumberOrString(r.costAmount) as number | null,
  };
}

@Injectable()
export class UsageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  private async getCurrentOrgId() {
    const member = await this.prisma.member.findFirst({
      where: { email: 'admin@opc.local' },
    });
    if (!member) {
      throw new NotFoundException('DEFAULT_USER_NOT_FOUND', '默认用户未找到');
    }
    return member.organizationId;
  }

  async listRecords(params: {
    projectId?: string;
    grantId?: string;
    usageType?: UsageType;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }) {
    const organizationId = await this.getCurrentOrgId();
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { organizationId };
    if (params.projectId) where.projectId = params.projectId;
    if (params.grantId) where.grantId = params.grantId;
    if (params.usageType) where.usageType = params.usageType;
    if (params.dateFrom || params.dateTo) {
      const occurredAt: Record<string, Date> = {};
      if (params.dateFrom) occurredAt.gte = new Date(params.dateFrom);
      if (params.dateTo) occurredAt.lte = new Date(params.dateTo);
      where.occurredAt = occurredAt;
    }

    const [items, total] = await Promise.all([
      this.prisma.usageRecord.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { occurredAt: 'desc' },
        include: { grant: true },
      }),
      this.prisma.usageRecord.count({ where }),
    ]);

    return {
      items: items.map((r) =>
        serializeUsageRecord(r as Record<string, unknown>),
      ),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async reserve(data: {
    projectId?: string;
    grantId: string;
    usageType: UsageType;
    workflowContext?: string;
    quantityUsed: number;
    costAmount?: number;
    traceId: string;
  }) {
    const organizationId = await this.getCurrentOrgId();
    const record = await this.prisma.usageRecord.create({
      data: {
        organizationId,
        projectId: data.projectId ?? null,
        grantId: data.grantId,
        usageType: data.usageType,
        workflowContext: data.workflowContext ?? null,
        quantityUsed: data.quantityUsed,
        costAmount: data.costAmount ?? null,
        traceId: data.traceId,
        status: 'reserved',
      },
    });
    return serializeUsageRecord(record as Record<string, unknown>);
  }

  async consume(data: {
    projectId?: string;
    usageType: UsageType;
    workflowContext?: string;
    quantityUsed: number;
    costAmount?: number;
    traceId: string;
  }) {
    const organizationId = await this.getCurrentOrgId();
    const wallet = await this.prisma.entitlementWallet.findUnique({
      where: { organizationId },
      include: {
        grants: {
          where: { status: 'active' },
          orderBy: [{ priority: 'asc' }, { expiresAt: 'asc' }],
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('WALLET_NOT_FOUND', '钱包未找到');
    }

    const now = new Date();
    let remaining = data.quantityUsed;
    const usableGrants = wallet.grants.filter(
      (g) => g.expiresAt === null || g.expiresAt > now,
    );
    const totalAvailable = usableGrants.reduce(
      (sum, g) => sum + (g.quantityAvailable?.toNumber() ?? 0),
      0,
    );

    if (totalAvailable < remaining) {
      throw new BadRequestException('INSUFFICIENT_BALANCE', '余额不足');
    }

    const updates: { grantId: string; deducted: number }[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (const grant of usableGrants) {
        if (remaining <= 0) break;
        const avail = grant.quantityAvailable.toNumber();
        const deduct = Math.min(avail, remaining);
        remaining -= deduct;
        updates.push({ grantId: grant.id, deducted: deduct });
        await tx.entitlementGrant.update({
          where: { id: grant.id },
          data: {
            quantityAvailable: { decrement: deduct },
            status: avail - deduct <= 0 ? 'exhausted' : undefined,
          },
        });
      }

      for (const u of updates) {
        await tx.usageRecord.create({
          data: {
            organizationId,
            projectId: data.projectId ?? null,
            grantId: u.grantId,
            usageType: data.usageType,
            workflowContext: data.workflowContext ?? null,
            quantityUsed: u.deducted,
            costAmount: data.costAmount ?? null,
            traceId: data.traceId,
            status: 'consumed',
          },
        });
      }
    });

    await this.auditLogsService.create({
      organizationId,
      entityType: 'UsageRecord',
      entityId: data.traceId,
      action: 'consume',
      payload: {
        projectId: data.projectId ?? null,
        usageType: data.usageType,
        quantityUsed: data.quantityUsed,
        costAmount: data.costAmount ?? null,
        details: updates,
      },
    });

    return {
      consumed: data.quantityUsed - remaining,
      traceId: data.traceId,
      details: updates,
    };
  }

  async rollback(data: {
    usageRecordId: string;
    reason: string;
    traceId: string;
  }) {
    const organizationId = await this.getCurrentOrgId();
    const record = await this.prisma.usageRecord.findFirst({
      where: { id: data.usageRecordId, organizationId },
    });

    if (!record) {
      throw new NotFoundException('USAGE_RECORD_NOT_FOUND', '使用记录不存在');
    }

    if (record.status === 'rolled_back') {
      throw new BadRequestException('ALREADY_ROLLED_BACK', '该记录已回滚');
    }

    await this.prisma.$transaction(async (tx) => {
      if (record.status === 'consumed') {
        await tx.entitlementGrant.update({
          where: { id: record.grantId },
          data: {
            quantityAvailable: { increment: record.quantityUsed.toNumber() },
            status: 'active',
          },
        });
      }

      await tx.usageRecord.update({
        where: { id: record.id },
        data: {
          status: 'rolled_back',
          traceId: data.traceId,
          workflowContext: record.workflowContext
            ? `${record.workflowContext} | rollback_reason: ${data.reason}`
            : `rollback_reason: ${data.reason}`,
        },
      });
    });

    return { success: true, usageRecordId: record.id, traceId: data.traceId };
  }
}
