import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        skip,
        take: pageSize,
        include: {
          organization: true,
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.member.count(),
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
    email: string;
    roleId: string;
    status?: string;
  }) {
    const existing = await this.prisma.member.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('EMAIL_EXISTS', '该邮箱已被使用');
    }

    return this.prisma.member.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        status: (data.status as any) ?? 'active',
      },
      include: {
        organization: true,
        role: true,
      },
    });
  }

  async update(memberId: string, data: { roleId?: string; status?: string }) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException('MEMBER_NOT_FOUND', '成员不存在');
    }

    return this.prisma.member.update({
      where: { id: memberId },
      data: {
        ...(data.roleId && { roleId: data.roleId }),
        ...(data.status && { status: data.status as any }),
      },
      include: {
        organization: true,
        role: true,
      },
    });
  }
}
