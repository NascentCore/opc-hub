import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MOCK_TOKEN = 'mock-jwt-token-for-sprint1';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const member = await this.prisma.member.findUnique({
      where: { email },
      include: {
        organization: true,
        role: true,
      },
    });

    if (!member) {
      throw new UnauthorizedException('INVALID_CREDENTIALS', '用户不存在或密码错误');
    }

    // TODO: replace with bcrypt.compare after integrating real password hashes
    if (password !== 'opc123456') {
      throw new UnauthorizedException('INVALID_CREDENTIALS', '用户不存在或密码错误');
    }

    await this.prisma.member.update({
      where: { id: member.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token: MOCK_TOKEN,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        status: member.status,
        lastLoginAt: member.lastLoginAt,
      },
      organization: member.organization,
      role: member.role,
    };
  }

  async getMe() {
    const member = await this.prisma.member.findFirst({
      where: { email: 'admin@opc.local' },
      include: {
        organization: true,
        role: true,
      },
    });

    if (!member) {
      throw new UnauthorizedException('NOT_FOUND', '默认用户未找到，请先执行 seed');
    }

    return {
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        status: member.status,
        lastLoginAt: member.lastLoginAt,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
      organization: member.organization,
      role: member.role,
    };
  }
}
