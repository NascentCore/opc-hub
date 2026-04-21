import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    organizationId?: string;
    entityType?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (params.organizationId) where.organizationId = params.organizationId;
    if (params.entityType) where.entityType = params.entityType;
    if (params.action) where.action = params.action;
    if (params.dateFrom || params.dateTo) {
      const createdAt: Record<string, Date> = {};
      if (params.dateFrom) createdAt.gte = new Date(params.dateFrom);
      if (params.dateTo) createdAt.lte = new Date(params.dateTo);
      where.createdAt = createdAt;
    }

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
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
    memberId?: string;
    entityType: string;
    entityId: string;
    action: string;
    payload?: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: {
        organizationId: data.organizationId,
        memberId: data.memberId ?? null,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        payloadJson: data.payload ? JSON.stringify(data.payload) : null,
      },
    });
  }
}
