import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AcceptanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll(projectId: string, page = 1, pageSize = 20) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const skip = (page - 1) * pageSize;
    const where: Prisma.AcceptanceRecordWhereInput = { projectId };

    const [items, total] = await Promise.all([
      this.prisma.acceptanceRecord.findMany({
        skip,
        take: pageSize,
        where,
        include: { deliveryPackage: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.acceptanceRecord.count({ where }),
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
      deliveryPackageId: string;
      decision: string;
      comment?: string;
      clientMemberId?: string;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const delivery = await this.prisma.deliveryPackage.findFirst({
      where: { id: data.deliveryPackageId, projectId },
    });
    if (!delivery) {
      throw new NotFoundException('DELIVERY_NOT_FOUND', '交付包不存在');
    }

    const decision = data.decision as any;
    if (!['approved', 'rejected', 'needs_change'].includes(decision)) {
      throw new BadRequestException(
        'INVALID_ACCEPTANCE_DECISION',
        '无效的验收决策',
      );
    }

    let nextDeliveryStatus: string | undefined;
    if (decision === 'approved') nextDeliveryStatus = 'approved';
    else if (decision === 'rejected') nextDeliveryStatus = 'rejected';
    else if (decision === 'needs_change') nextDeliveryStatus = 'under_review';

    const [record] = await this.prisma.$transaction([
      this.prisma.acceptanceRecord.create({
        data: {
          projectId,
          deliveryPackageId: data.deliveryPackageId,
          clientMemberId: data.clientMemberId ?? null,
          decision,
          comment: data.comment ?? null,
        },
        include: { deliveryPackage: true },
      }),
      this.prisma.deliveryPackage.update({
        where: { id: data.deliveryPackageId },
        data: { status: nextDeliveryStatus as any },
      }),
    ]);

    await this.auditLogsService.create({
      organizationId: project.organizationId,
      entityType: 'AcceptanceRecord',
      entityId: record.id,
      action: `acceptance_${decision}`,
      payload: {
        projectId,
        deliveryPackageId: data.deliveryPackageId,
        decision,
        comment: data.comment ?? null,
      },
    });

    return record;
  }
}
