import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DeliveriesService {
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
    const where: Prisma.DeliveryPackageWhereInput = { projectId };

    const [items, total] = await Promise.all([
      this.prisma.deliveryPackage.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.deliveryPackage.count({ where }),
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
      versionNo: string;
      title: string;
      summary?: string;
      artifactUrl?: string;
      releaseProofUrl?: string;
      createdBy: string;
    },
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('PROJECT_NOT_FOUND', '项目不存在');
    }

    const delivery = await this.prisma.deliveryPackage.create({
      data: {
        projectId,
        versionNo: data.versionNo,
        title: data.title,
        summary: data.summary ?? null,
        artifactUrl: data.artifactUrl ?? null,
        releaseProofUrl: data.releaseProofUrl ?? null,
        createdBy: data.createdBy,
        status: 'draft',
      },
    });

    await this.auditLogsService.create({
      organizationId: project.organizationId,
      entityType: 'DeliveryPackage',
      entityId: delivery.id,
      action: 'delivery_created',
      payload: {
        projectId,
        versionNo: data.versionNo,
        title: data.title,
      },
    });

    return delivery;
  }

  async findOne(projectId: string, deliveryId: string) {
    const delivery = await this.prisma.deliveryPackage.findFirst({
      where: { id: deliveryId, projectId },
    });
    if (!delivery) {
      throw new NotFoundException('DELIVERY_NOT_FOUND', '交付包不存在');
    }
    return delivery;
  }

  async submit(projectId: string, deliveryId: string) {
    const delivery = await this.prisma.deliveryPackage.findFirst({
      where: { id: deliveryId, projectId },
    });
    if (!delivery) {
      throw new NotFoundException('DELIVERY_NOT_FOUND', '交付包不存在');
    }

    if (delivery.status !== 'draft') {
      throw new BadRequestException(
        'DELIVERY_NOT_SUBMITTABLE',
        '交付包状态不允许提交',
      );
    }

    return this.prisma.deliveryPackage.update({
      where: { id: deliveryId },
      data: { status: 'submitted' },
    });
  }
}
