import { Test, TestingModule } from '@nestjs/testing';
import { EntitlementsService } from './entitlements.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('EntitlementsService', () => {
  let service: EntitlementsService;

  const mockPrisma = {
    member: {
      findFirst: jest.fn(),
    },
    entitlementWallet: {
      findUnique: jest.fn(),
    },
    entitlementGrant: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntitlementsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<EntitlementsService>(EntitlementsService);
    jest.clearAllMocks();
  });

  const setupWallet = () => {
    mockPrisma.member.findFirst.mockResolvedValue({
      id: 'm1',
      organizationId: 'o1',
      email: 'admin@opc.local',
    });
    mockPrisma.entitlementWallet.findUnique.mockResolvedValue({
      id: 'w1',
      organizationId: 'o1',
    });
  };

  describe('createGrant', () => {
    it('should create a grant and log audit', async () => {
      setupWallet();
      const created = {
        id: 'g1',
        walletId: 'w1',
        grantType: 'token',
        grantName: 'Test Grant',
        sourceType: 'manual',
        quantityTotal: new Decimal(100),
        quantityAvailable: new Decimal(100),
        priority: 0,
      };
      mockPrisma.entitlementGrant.create.mockResolvedValue(created);

      const result = await service.createGrant({
        grantType: 'token' as any,
        grantName: 'Test Grant',
        sourceType: 'manual' as any,
        quantityTotal: 100,
        quantityAvailable: 100,
      });

      expect(result.quantityTotal).toBe(100);
      expect(result.quantityAvailable).toBe(100);
      expect(mockPrisma.entitlementGrant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            walletId: 'w1',
            grantName: 'Test Grant',
            quantityTotal: 100,
            quantityAvailable: 100,
          }),
        }),
      );
      expect(mockAuditLogsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when wallet not found', async () => {
      mockPrisma.member.findFirst.mockResolvedValue({
        id: 'm1',
        organizationId: 'o1',
        email: 'admin@opc.local',
      });
      mockPrisma.entitlementWallet.findUnique.mockResolvedValue(null);

      await expect(
        service.createGrant({
          grantType: 'token' as any,
          grantName: 'Test Grant',
          sourceType: 'manual' as any,
          quantityTotal: 100,
          quantityAvailable: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('batchCreateGrants', () => {
    it('should create multiple grants in a transaction', async () => {
      setupWallet();
      mockPrisma.$transaction = jest.fn(async (ops) => {
        return ops.map((_: any, i: number) => ({
          id: `g${i + 1}`,
          walletId: 'w1',
          grantType: 'token',
          grantName: `Grant ${i + 1}`,
          sourceType: 'manual',
          quantityTotal: new Decimal(50),
          quantityAvailable: new Decimal(50),
          priority: 0,
        }));
      });
      (mockPrisma as any).$transaction = mockPrisma.$transaction;

      const result = await service.batchCreateGrants([
        {
          grantType: 'token' as any,
          grantName: 'Grant 1',
          sourceType: 'manual' as any,
          quantityTotal: 50,
          quantityAvailable: 50,
        },
        {
          grantType: 'tool' as any,
          grantName: 'Grant 2',
          sourceType: 'manual' as any,
          quantityTotal: 50,
          quantityAvailable: 50,
        },
      ]);

      expect(result).toHaveLength(2);
      expect(result[0].quantityTotal).toBe(50);
      expect(result[1].quantityTotal).toBe(50);
    });
  });
});
