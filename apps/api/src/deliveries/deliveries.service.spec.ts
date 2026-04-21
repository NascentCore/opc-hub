import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesService } from './deliveries.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DeliveriesService', () => {
  let service: DeliveriesService;

  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
    },
    deliveryPackage: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    jest.clearAllMocks();
  });

  describe('createDelivery', () => {
    it('should create a delivery package and log audit', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({
        id: 'p1',
        organizationId: 'o1',
      });
      const created = {
        id: 'd1',
        projectId: 'p1',
        versionNo: 'v1.0.0',
        title: 'First Delivery',
        status: 'draft',
      };
      mockPrisma.deliveryPackage.create.mockResolvedValue(created);

      const result = await service.create('p1', {
        versionNo: 'v1.0.0',
        title: 'First Delivery',
        createdBy: 'm1',
      });

      expect(result).toEqual(created);
      expect(mockPrisma.deliveryPackage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            projectId: 'p1',
            versionNo: 'v1.0.0',
            title: 'First Delivery',
            status: 'draft',
          }),
        }),
      );
      expect(mockAuditLogsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await expect(
        service.create('p1', {
          versionNo: 'v1.0.0',
          title: 'First Delivery',
          createdBy: 'm1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitDelivery', () => {
    it('should submit a draft delivery', async () => {
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue({
        id: 'd1',
        projectId: 'p1',
        status: 'draft',
      });
      mockPrisma.deliveryPackage.update.mockResolvedValue({
        id: 'd1',
        status: 'submitted',
      });

      const result = await service.submit('p1', 'd1');

      expect(result.status).toBe('submitted');
      expect(mockPrisma.deliveryPackage.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'd1' },
          data: { status: 'submitted' },
        }),
      );
    });

    it('should throw NotFoundException when delivery not found', async () => {
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue(null);

      await expect(service.submit('p1', 'd1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when delivery is not draft', async () => {
      mockPrisma.deliveryPackage.findFirst.mockResolvedValue({
        id: 'd1',
        projectId: 'p1',
        status: 'submitted',
      });

      await expect(service.submit('p1', 'd1')).rejects.toThrow(BadRequestException);
    });
  });
});
