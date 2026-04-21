import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent() {
    const member = await this.prisma.member.findFirst({
      where: { email: 'admin@opc.local' },
    });

    if (!member) {
      throw new NotFoundException('DEFAULT_USER_NOT_FOUND', '默认用户未找到');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: member.organizationId },
      include: {
        members: {
          include: { role: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('ORGANIZATION_NOT_FOUND', '组织未找到');
    }

    return organization;
  }
}
