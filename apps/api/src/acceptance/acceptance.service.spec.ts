import { Test, TestingModule } from '@nestjs/testing';
import { AcceptanceService } from './acceptance.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AcceptanceService', () => {
  let service: AcceptanceService;

  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
    },
    deliveryPackage: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    acceptanceRecord: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(async (ops) => {
      if (Array.isArray(ops)) {
        const results = [];
        for (const op of ops) {
          results.push(await op);
        }
        return results;
      }
      return ops(mockPrisma);
    }),
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcceptanceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<AcceptanceService>(AcceptanceService);
    jest.clearAllMocks();
  });

  describe('createAcceptanceRecord', () => {
    it('should create an approved acceptance record and update delivery status', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        organizationId: 'o1',
      });
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue({
        id: 'd1',
        projectId: 'p1',
      });
      const record = {
        id: 'a1',
        projectId: 'p1',
        deliveryPackageId: 'd1',
        decision: 'approved',
        deliveryPackage: { id: 'd1' },
      };
      mockPrisma.acceptanceRecord.create.mockResolvedValue(record);
      mockPrisma.deliveryPackage.update.mockResolvedValue({ id: 'd1', status: 'approved' });

      const result = await service.create('p1', {
        deliveryPackageId: 'd1',
        decision: 'approved',
        comment: 'Looks good',
      });

      expect(result.decision).toBe('approved');
      expect(mockPrisma.acceptanceRecord.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            projectId: 'p1',
            deliveryPackageId: 'd1',
            decision: 'approved',
            comment: 'Looks good',
          }),
        }),
      );
      expect(mockPrisma.deliveryPackage.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'd1' },
          data: { status: 'approved' },
        }),
      );
      expect(mockAuditLogsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await expect(
        service.create('p1', {
          deliveryPackageId: 'd1',
          decision: 'approved',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when delivery not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        organizationId: 'o1',
      });
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue(null);

      await expect(
        service.create('p1', {
          deliveryPackageId: 'd1',
          decision: 'approved',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid decision', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        organizationId: 'o1',
      });
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue({
        id: 'd1',
        projectId: 'p1',
      });

      await expect(
        service.create('p1', {
          deliveryPackageId: 'd1',
          decision: 'invalid',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
