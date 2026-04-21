import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(
    filters: { status?: string; clientId?: string; industryPack?: string },
    page = 1,
    pageSize = 20,
  ) {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.clientId) {
      where.clientId = filters.clientId;
    }
    if (filters.industryPack) {
      where.industryPack = filters.industryPack;
    }

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: pageSize,
        where,
        include: {
          organization: true,
          client: true,
          scopeVersions: { orderBy: { versionNo: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async create(data: {
    organizationId: string;
    clientId: string;
    name: string;
    industryPack: string;
    status?: string;
    budgetAmount?: number;
    startDate?: string;
    dueDate?: string;
    repoBindingId?: string;
    createdBy: string;
  }) {
    const project = await this.prisma.project.create({
      data: {
        organizationId: data.organizationId,
        clientId: data.clientId,
        name: data.name,
        industryPack: data.industryPack,
        status: (data.status as any) ?? 'draft',
        budgetAmount: data.budgetAmount !== undefined ? data.budgetAmount : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        repoBindingId: data.repoBindingId,
        createdBy: data.createdBy,
        scopeVersions: {
          create: {
            versionNo: 1,
            scopeSummary: '初始 Scope',
            status: 'draft',
          },
        },
      },
      include: {
        organization: true,
        client: true,
        scopeVersions: true,
      },
    });

    await this.auditLogsService.create({
      organizationId: data.organizationId,
      entityType: 'Project',
      entityId: project.id,
      action: 'project_created',
      payload: {
        name: data.name,
        clientId: data.clientId,
        industryPack: data.industryPack,
      },
    });

    return project;
  }

  async findOne(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        organization: true,
        client: true,
        scopeVersions: { orderBy: { versionNo: 'desc' } },
        usageRecords: true,
      },
    });

    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const currentScope =
      project.scopeVersions.find((s) => s.status === 'frozen') ??
      project.scopeVersions[0] ??
      null;

    const deliveryStatus = this.resolveDeliveryStatus(project.status);
    const latestAcceptance = null;

    const revenue = currentScope?.quotedAmount
      ? Number(currentScope.quotedAmount)
      : 0;
    const cost = project.usageRecords.reduce(
      (sum, r) => sum + (r.costAmount ? Number(r.costAmount) : 0),
      0,
    );
    const profit = revenue - cost;

    return {
      project,
      currentScope,
      deliveryStatus,
      latestAcceptance,
      profitSummary: { revenue, cost, profit },
    };
  }

  async update(
    projectId: string,
    data: {
      name?: string;
      clientId?: string;
      industryPack?: string;
      status?: string;
      budgetAmount?: number;
      startDate?: string;
      dueDate?: string;
      repoBindingId?: string;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.clientId !== undefined && { clientId: data.clientId }),
        ...(data.industryPack !== undefined && { industryPack: data.industryPack }),
        ...(data.status !== undefined && { status: data.status as any }),
        ...(data.budgetAmount !== undefined && { budgetAmount: data.budgetAmount }),
        ...(data.startDate !== undefined && {
          startDate: data.startDate ? new Date(data.startDate) : null,
        }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.repoBindingId !== undefined && { repoBindingId: data.repoBindingId }),
      },
      include: {
        organization: true,
        client: true,
        scopeVersions: { orderBy: { versionNo: 'desc' }, take: 1 },
      },
    });
  }

  private resolveDeliveryStatus(status: string): string {
    const map: Record<string, string> = {
      draft: '待提交',
      scoped: '已排期',
      in_progress: '交付中',
      pending_acceptance: '待验收',
      accepted: '已验收',
      archived: '已归档',
    };
    return map[status] ?? '未知';
  }
}
