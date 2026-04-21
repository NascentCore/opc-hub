import { Test, TestingModule } from '@nestjs/testing';
import { ProfitService } from './profit.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProfitService', () => {
  let service: ProfitService;

  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
    },
    profitLedger: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    usageRecord: {
      findMany: jest.fn(),
    },
    entitlementGrant: {
      aggregate: jest.fn(),
    },
    organization: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfitService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProfitService>(ProfitService);
    jest.clearAllMocks();
  });

  describe('getProjectProfit', () => {
    it('should return existing ledger when available', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({ id: 'p1' });
      mockPrisma.profitLedger.findFirst.mockResolvedValue({
        projectId: 'p1',
        periodType: 'project_total',
        tokenCostAmount: new Decimal(100),
        toolCostAmount: new Decimal(50),
        laborCostAmount: new Decimal(0),
        otherCostAmount: new Decimal(0),
        revenueAmount: new Decimal(1000),
        grossProfitAmount: new Decimal(850),
        grossMargin: new Decimal(85),
      });

      const result = await service.getProjectProfit('p1');

      expect(result.tokenCostAmount).toBe(100);
      expect(result.revenueAmount).toBe(1000);
      expect(result.grossProfitAmount).toBe(850);
    });

    it('should recalculate when no ledger exists', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        budgetAmount: new Decimal(5000),
        scopeVersions: [{ status: 'frozen', quotedAmount: new Decimal(6000) }],
      });
      mockPrisma.profitLedger.findFirst.mockResolvedValue(null);
      mockPrisma.usageRecord.findMany.mockResolvedValue([]);
      mockPrisma.profitLedger.upsert.mockResolvedValue({
        projectId: 'p1',
        periodType: 'project_total',
        tokenCostAmount: new Decimal(0),
        toolCostAmount: new Decimal(0),
        laborCostAmount: new Decimal(0),
        otherCostAmount: new Decimal(0),
        revenueAmount: new Decimal(6000),
        grossProfitAmount: new Decimal(6000),
        grossMargin: new Decimal(100),
      });

      const result = await service.getProjectProfit('p1');

      expect(result.revenueAmount).toBe(6000);
      expect(result.grossProfitAmount).toBe(6000);
      expect(mockPrisma.profitLedger.upsert).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await expect(service.getProjectProfit('p1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recalculateProjectProfit', () => {
    it('should calculate costs from usage records and upsert ledger', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        budgetAmount: new Decimal(3000),
        scopeVersions: [],
      });
      mockPrisma.usageRecord.findMany.mockResolvedValue([
        { usageType: 'token_call', costAmount: new Decimal(100) },
        { usageType: 'model_use', costAmount: new Decimal(200) },
        { usageType: 'tool_run', costAmount: new Decimal(50) },
        { usageType: 'manual_adjustment', costAmount: new Decimal(30) },
      ]);
      mockPrisma.profitLedger.upsert.mockResolvedValue({
        projectId: 'p1',
        periodType: 'project_total',
        tokenCostAmount: new Decimal(300),
        toolCostAmount: new Decimal(50),
        laborCostAmount: new Decimal(0),
        otherCostAmount: new Decimal(30),
        revenueAmount: new Decimal(3000),
        grossProfitAmount: new Decimal(2620),
        grossMargin: new Decimal(87.33333333333333),
      });

      const result = await service.recalculateProjectProfit('p1');

      expect(result.tokenCostAmount).toBe(300);
      expect(result.toolCostAmount).toBe(50);
      expect(result.otherCostAmount).toBe(30);
      expect(result.revenueAmount).toBe(3000);
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await expect(service.recalculateProjectProfit('p1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when upsert fails', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        budgetAmount: new Decimal(1000),
        scopeVersions: [],
      });
      mockPrisma.usageRecord.findMany.mockResolvedValue([]);
      mockPrisma.profitLedger.upsert.mockRejectedValue(new Error('db error'));

      await expect(service.recalculateProjectProfit('p1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
