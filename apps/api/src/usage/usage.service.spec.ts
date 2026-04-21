import { Test, TestingModule } from '@nestjs/testing';
import { UsageService } from './usage.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('UsageService', () => {
  let service: UsageService;

  const mockTx = {
    entitlementGrant: {
      update: jest.fn().mockResolvedValue({}),
    },
    usageRecord: {
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
    },
  };

  const mockPrisma = {
    member: {
      findFirst: jest.fn(),
    },
    usageRecord: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
    },
    entitlementWallet: {
      findUnique: jest.fn(),
    },
    entitlementGrant: {
      update: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (cb) => cb(mockTx)),
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsageService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<UsageService>(UsageService);
    jest.clearAllMocks();
  });

  const setupDefaultMember = () => {
    mockPrisma.member.findFirst.mockResolvedValue({
      id: 'm1',
      organizationId: 'o1',
      email: 'admin@opc.local',
    });
  };

  describe('listRecords', () => {
    it('should return paginated usage records', async () => {
      setupDefaultMember();
      const items = [
        { id: 'u1', quantityUsed: new Decimal(10), costAmount: new Decimal(5) },
      ];
      mockPrisma.usageRecord.findMany.mockResolvedValue(items);
      mockPrisma.usageRecord.count.mockResolvedValue(1);

      const result = await service.listRecords({});

      expect(result.items[0].quantityUsed).toBe(10);
      expect(result.items[0].costAmount).toBe(5);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('consume', () => {
    it('should consume from grants and create usage records', async () => {
      setupDefaultMember();
      mockPrisma.entitlementWallet.findUnique.mockResolvedValue({
        id: 'w1',
        organizationId: 'o1',
        grants: [
          {
            id: 'g1',
            quantityAvailable: new Decimal(100),
            expiresAt: null,
            priority: 1,
          },
        ],
      });

      const result = await service.consume({
        usageType: 'token_call' as any,
        quantityUsed: 30,
        traceId: 't1',
      });

      expect(result.consumed).toBe(30);
      expect(result.details).toEqual([{ grantId: 'g1', deducted: 30 }]);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockAuditLogsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when wallet not found', async () => {
      setupDefaultMember();
      mockPrisma.entitlementWallet.findUnique.mockResolvedValue(null);

      await expect(
        service.consume({
          usageType: 'token_call' as any,
          quantityUsed: 10,
          traceId: 't1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when balance insufficient', async () => {
      setupDefaultMember();
      mockPrisma.entitlementWallet.findUnique.mockResolvedValue({
        id: 'w1',
        organizationId: 'o1',
        grants: [
          {
            id: 'g1',
            quantityAvailable: new Decimal(5),
            expiresAt: null,
            priority: 1,
          },
        ],
      });

      await expect(
        service.consume({
          usageType: 'token_call' as any,
          quantityUsed: 10,
          traceId: 't1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('rollback', () => {
    it('should rollback a consumed record and restore grant balance', async () => {
      setupDefaultMember();
      mockPrisma.usageRecord.findFirst.mockResolvedValue({
        id: 'u1',
        grantId: 'g1',
        quantityUsed: new Decimal(20),
        status: 'consumed',
        workflowContext: 'ctx',
      });

      const result = await service.rollback({
        usageRecordId: 'u1',
        reason: 'refund',
        traceId: 't2',
      });

      expect(result.success).toBe(true);
      expect(mockTx.entitlementGrant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'g1' },
          data: {
            quantityAvailable: { increment: 20 },
            status: 'active',
          },
        }),
      );
      expect(mockTx.usageRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u1' },
          data: expect.objectContaining({ status: 'rolled_back' }),
        }),
      );
    });

    it('should throw NotFoundException when usage record not found', async () => {
      setupDefaultMember();
      mockPrisma.usageRecord.findFirst.mockResolvedValue(null);

      await expect(
        service.rollback({
          usageRecordId: 'u1',
          reason: 'refund',
          traceId: 't2',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when record already rolled back', async () => {
      setupDefaultMember();
      mockPrisma.usageRecord.findFirst.mockResolvedValue({
        id: 'u1',
        status: 'rolled_back',
      });

      await expect(
        service.rollback({
          usageRecordId: 'u1',
          reason: 'refund',
          traceId: 't2',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
