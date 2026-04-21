import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { GrantStatus, GrantType, SourceType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

function toNumberOrString(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  return value;
}

function serializeGrant(g: Record<string, unknown>) {
  return {
    ...g,
    quantityTotal: toNumberOrString(g.quantityTotal) as number,
    quantityAvailable: toNumberOrString(g.quantityAvailable) as number,
  };
}

@Injectable()
export class EntitlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  private async getWalletForCurrentOrg() {
    const member = await this.prisma.member.findFirst({
      where: { email: 'admin@opc.local' },
    });
    if (!member) {
      throw new NotFoundException('DEFAULT_USER_NOT_FOUND', '默认用户未找到');
    }
    const wallet = await this.prisma.entitlementWallet.findUnique({
      where: { organizationId: member.organizationId },
    });
    if (!wallet) {
      throw new NotFoundException('WALLET_NOT_FOUND', '钱包未找到');
    }
    return wallet;
  }

  async listGrants(filters: {
    status?: GrantStatus;
    grantType?: GrantType;
    expiresBefore?: string;
  }) {
    const wallet = await this.getWalletForCurrentOrg();
    const where: Record<string, unknown> = { walletId: wallet.id };
    if (filters.status) where.status = filters.status;
    if (filters.grantType) where.grantType = filters.grantType;
    if (filters.expiresBefore) {
      where.expiresAt = { lte: new Date(filters.expiresBefore) };
    }

    const grants = await this.prisma.entitlementGrant.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { expiresAt: 'asc' }],
    });

    return grants.map((g) => serializeGrant(g as Record<string, unknown>));
  }

  async createGrant(data: {
    grantType: GrantType;
    grantName: string;
    sourceType: SourceType;
    quantityTotal: number;
    quantityAvailable: number;
    priority?: number;
    expiresAt?: string;
  }) {
    const wallet = await this.getWalletForCurrentOrg();
    const grant = await this.prisma.entitlementGrant.create({
      data: {
        walletId: wallet.id,
        grantType: data.grantType,
        grantName: data.grantName,
        sourceType: data.sourceType,
        quantityTotal: data.quantityTotal,
        quantityAvailable: data.quantityAvailable,
        priority: data.priority ?? 0,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });

    await this.auditLogsService.create({
      organizationId: wallet.organizationId,
      entityType: 'EntitlementGrant',
      entityId: grant.id,
      action: 'grant_created',
      payload: {
        grantType: data.grantType,
        grantName: data.grantName,
        sourceType: data.sourceType,
        quantityTotal: data.quantityTotal,
      },
    });

    return serializeGrant(grant as Record<string, unknown>);
  }

  async batchCreateGrants(
    grants: {
      grantType: GrantType;
      grantName: string;
      sourceType: SourceType;
      quantityTotal: number;
      quantityAvailable: number;
      priority?: number;
      expiresAt?: string;
    }[],
  ) {
    const wallet = await this.getWalletForCurrentOrg();
    const created = await this.prisma.$transaction(
      grants.map((g) =>
        this.prisma.entitlementGrant.create({
          data: {
            walletId: wallet.id,
            grantType: g.grantType,
            grantName: g.grantName,
            sourceType: g.sourceType,
            quantityTotal: g.quantityTotal,
            quantityAvailable: g.quantityAvailable,
            priority: g.priority ?? 0,
            expiresAt: g.expiresAt ? new Date(g.expiresAt) : undefined,
          },
        }),
      ),
    );
    return created.map((g) => serializeGrant(g as Record<string, unknown>));
  }

  listRules() {
    return [];
  }

  createRule() {
    return { id: 'mock-rule-id', message: 'mock rule created' };
  }
}
