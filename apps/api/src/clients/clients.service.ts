import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(name?: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: pageSize,
        where,
        include: { organization: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
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
    name: string;
    contactName?: string;
    contactEmail?: string;
    status?: string;
    notes?: string;
  }) {
    return this.prisma.client.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        status: (data.status as any) ?? 'active',
        notes: data.notes,
      },
      include: { organization: true },
    });
  }

  async findOne(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { organization: true },
    });
    if (!client) {
      throw new NotFoundException('CLIENT_NOT_FOUND', '客户不存在');
    }
    return client;
  }

  async update(
    clientId: string,
    data: {
      name?: string;
      contactName?: string;
      contactEmail?: string;
      status?: string;
      notes?: string;
    },
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('CLIENT_NOT_FOUND', '客户不存在');
    }

    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.contactName !== undefined && { contactName: data.contactName }),
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.status !== undefined && { status: data.status as any }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: { organization: true },
    });
  }
}
