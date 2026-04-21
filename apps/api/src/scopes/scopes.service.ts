import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScopesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    return this.prisma.scopeVersion.findMany({
      where: { projectId },
      orderBy: { versionNo: 'desc' },
    });
  }

  async create(
    projectId: string,
    data: {
      scopeSummary: string;
      quotedAmount?: number;
      deliveryPlan?: string;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const latest = await this.prisma.scopeVersion.findFirst({
      where: { projectId },
      orderBy: { versionNo: 'desc' },
    });

    const nextVersionNo = (latest?.versionNo ?? 0) + 1;

    return this.prisma.scopeVersion.create({
      data: {
        projectId,
        versionNo: nextVersionNo,
        scopeSummary: data.scopeSummary,
        quotedAmount: data.quotedAmount,
        deliveryPlan: data.deliveryPlan,
        status: 'draft',
      },
    });
  }

  async freeze(projectId: string, scopeId: string) {
    const scope = await this.prisma.scopeVersion.findFirst({
      where: { id: scopeId, projectId },
    });

    if (!scope) {
      throw new NotFoundException('SCOPE_NOT_FOUND', 'Scope 不存在');
    }

    if (scope.status !== 'draft') {
      throw new BadRequestException('SCOPE_NOT_DRAFT', '只能冻结 draft 状态的 Scope');
    }

    return this.prisma.scopeVersion.update({
      where: { id: scopeId },
      data: {
        status: 'frozen',
        frozenAt: new Date(),
      },
    });
  }
}
