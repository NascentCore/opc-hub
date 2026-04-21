import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function toNumberOrString(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Decimal) {
    return value.toNumber();
  }
  return value;
}

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const member = await this.prisma.member.findFirst({
      where: { email: 'admin@opc.local' },
    });

    if (!member) {
      throw new NotFoundException('DEFAULT_USER_NOT_FOUND', '默认用户未找到');
    }

    const wallet = await this.prisma.entitlementWallet.findUnique({
      where: { organizationId: member.organizationId },
      include: {
        grants: {
          orderBy: [{ priority: 'asc' }, { expiresAt: 'asc' }],
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('WALLET_NOT_FOUND', '钱包未找到');
    }

    const now = new Date();
    const activeGrants = wallet.grants.filter(
      (g) =>
        g.status === 'active' && (g.expiresAt === null || g.expiresAt > now),
    );

    const totalBalance = activeGrants.reduce(
      (sum, g) => sum + (g.quantityAvailable?.toNumber() ?? 0),
      0,
    );

    const expiringSoon = activeGrants
      .filter(
        (g) =>
          g.expiresAt !== null &&
          g.expiresAt.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000,
      )
      .map((g) => ({
        id: g.id,
        grantType: g.grantType,
        grantName: g.grantName,
        quantityAvailable: toNumberOrString(g.quantityAvailable) as number,
        expiresAt: g.expiresAt,
      }));

    const availableGrants = activeGrants.map((g) => ({
      id: g.id,
      grantType: g.grantType,
      grantName: g.grantName,
      sourceType: g.sourceType,
      quantityTotal: toNumberOrString(g.quantityTotal) as number,
      quantityAvailable: toNumberOrString(g.quantityAvailable) as number,
      priority: g.priority,
      expiresAt: g.expiresAt,
      status: g.status,
      createdAt: g.createdAt,
    }));

    return {
      walletId: wallet.id,
      organizationId: wallet.organizationId,
      currency: wallet.currency,
      status: wallet.status,
      totalBalance,
      availableGrants,
      expiringSoon,
    };
  }
}
