import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    member: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return token and user info on valid credentials', async () => {
      const member = {
        id: 'm1',
        name: 'Admin',
        email: 'admin@opc.local',
        status: 'active',
        lastLoginAt: new Date('2024-01-01'),
        organization: { id: 'o1', name: 'Org' },
        role: { id: 'r1', name: 'Admin' },
      };
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.member.update.mockResolvedValue({ ...member, lastLoginAt: new Date() });

      const result = await service.login('admin@opc.local', 'opc123456');

      expect(result.token).toBe('mock-jwt-token-for-sprint1');
      expect(result.user.id).toBe('m1');
      expect(result.organization).toEqual(member.organization);
      expect(result.role).toEqual(member.role);
      expect(mockPrisma.member.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'm1' },
          data: { lastLoginAt: expect.any(Date) },
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(service.login('nobody@opc.local', 'opc123456')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getMe', () => {
    it('should return default user info', async () => {
      const member = {
        id: 'm1',
        name: 'Admin',
        email: 'admin@opc.local',
        status: 'active',
        lastLoginAt: new Date('2024-01-01'),
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-06-01'),
        organization: { id: 'o1', name: 'Org' },
        role: { id: 'r1', name: 'Admin' },
      };
      mockPrisma.member.findFirst.mockResolvedValue(member);

      const result = await service.getMe();

      expect(result.user.email).toBe('admin@opc.local');
      expect(result.organization).toEqual(member.organization);
      expect(result.role).toEqual(member.role);
    });

    it('should throw UnauthorizedException when default user missing', async () => {
      mockPrisma.member.findFirst.mockResolvedValue(null);

      await expect(service.getMe()).rejects.toThrow(UnauthorizedException);
    });
  });
});
