import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockPrisma = {
    project: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAuditLogsService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const items = [{ id: 'p1', name: 'Project A' }];
      mockPrisma.project.findMany.mockResolvedValue(items);
      mockPrisma.project.count.mockResolvedValue(1);

      const result = await service.findAll({}, 1, 20);

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a project with initial scope and audit log', async () => {
      const created = {
        id: 'p1',
        name: 'Project A',
        organization: { id: 'o1' },
        client: { id: 'c1' },
        scopeVersions: [{ versionNo: 1 }],
      };
      mockPrisma.project.create.mockResolvedValue(created);

      const result = await service.create({
        organizationId: 'o1',
        clientId: 'c1',
        name: 'Project A',
        industryPack: 'saas',
        createdBy: 'm1',
      });

      expect(result).toEqual(created);
      expect(mockPrisma.project.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Project A',
            status: 'draft',
            scopeVersions: {
              create: {
                versionNo: 1,
                scopeSummary: '初始 Scope',
                status: 'draft',
              },
            },
          }),
        }),
      );
      expect(mockAuditLogsService.create).toHaveBeenCalled();
    });
  });

  describe('findOne (getProjectDetail)', () => {
    it('should return project detail with scope and profit summary', async () => {
      const project = {
        id: 'p1',
        status: 'draft',
        scopeVersions: [
          { status: 'frozen', quotedAmount: 10000 },
          { status: 'draft', quotedAmount: 5000 },
        ],
        usageRecords: [
          { costAmount: 2000 },
          { costAmount: 1000 },
        ],
      };
      mockPrisma.project.findUnique.mockResolvedValue(project);

      const result = await service.findOne('p1');

      expect(result.project).toEqual(project);
      expect(result.currentScope).toEqual(project.scopeVersions[0]);
      expect(result.profitSummary).toEqual({ revenue: 10000, cost: 3000, profit: 7000 });
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      await expect(service.findOne('p1')).rejects.toThrow(NotFoundException);
    });
  });
});
