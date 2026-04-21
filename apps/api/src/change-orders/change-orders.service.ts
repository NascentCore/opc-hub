import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChangeOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string, page = 1, pageSize = 20) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const skip = (page - 1) * pageSize;
    const where: Prisma.ChangeOrderWhereInput = { projectId };

    const [items, total] = await Promise.all([
      this.prisma.changeOrder.findMany({
        skip,
        take: pageSize,
        where,
        include: { scopeVersion: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.changeOrder.count({ where }),
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

  async create(
    projectId: string,
    data: {
      scopeVersionId?: string;
      title: string;
      changeType: string;
      amountDelta?: number;
      description?: string;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    if (data.scopeVersionId) {
      const scope = await this.prisma.scopeVersion.findFirst({
        where: { id: data.scopeVersionId, projectId },
      });
      if (!scope) {
        throw new NotFoundException('SCOPE_NOT_FOUND', 'Scope 不存在');
      }
    }

    return this.prisma.changeOrder.create({
      data: {
        projectId,
        scopeVersionId: data.scopeVersionId ?? null,
        title: data.title,
        changeType: data.changeType as any,
        amountDelta: data.amountDelta !== undefined ? data.amountDelta : null,
        description: data.description ?? null,
        status: 'draft',
      },
      include: { scopeVersion: true },
    });
  }

  async update(
    projectId: string,
    changeOrderId: string,
    data: {
      title?: string;
      changeType?: string;
      amountDelta?: number;
      description?: string;
      status?: string;
    },
  ) {
    const changeOrder = await this.prisma.changeOrder.findFirst({
      where: { id: changeOrderId, projectId },
    });
    if (!changeOrder) {
      throw new NotFoundException('CHANGE_ORDER_NOT_FOUND', '变更单不存在');
    }

    const updateData: Prisma.ChangeOrderUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.changeType !== undefined) updateData.changeType = data.changeType as any;
    if (data.amountDelta !== undefined) updateData.amountDelta = data.amountDelta;
    if (data.description !== undefined) updateData.description = data.description;

    if (data.status !== undefined) {
      const nextStatus = data.status as any;
      updateData.status = nextStatus;
      if (nextStatus === 'submitted') {
        updateData.submittedAt = new Date();
      }
      if (nextStatus === 'approved' || nextStatus === 'rejected') {
        updateData.resolvedAt = new Date();
      }
    }

    return this.prisma.changeOrder.update({
      where: { id: changeOrderId },
      data: updateData,
      include: { scopeVersion: true },
    });
  }
}
