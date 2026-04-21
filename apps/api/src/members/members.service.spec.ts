import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MembersService', () => {
  let service: MembersService;

  const mockPrisma = {
    member: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    jest.clearAllMocks();
  });

  describe('findAll (list)', () => {
    it('should return paginated members', async () => {
      const items = [{ id: 'm1', name: 'A' }];
      mockPrisma.member.findMany.mockResolvedValue(items);
      mockPrisma.member.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20);

      expect(result.items).toEqual(items);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe('create', () => {
    it('should create a new member when email is unique', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      const created = {
        id: 'm2',
        name: 'Bob',
        email: 'bob@opc.local',
        organization: { id: 'o1' },
        role: { id: 'r1' },
      };
      mockPrisma.member.create.mockResolvedValue(created);

      const result = await service.create({
        organizationId: 'o1',
        name: 'Bob',
        email: 'bob@opc.local',
        roleId: 'r1',
      });

      expect(result).toEqual(created);
      expect(mockPrisma.member.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'bob@opc.local', status: 'active' }),
        }),
      );
    });

    it('should throw BadRequestException when email exists', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({ id: 'm1', email: 'bob@opc.local' });

      await expect(
        service.create({
          organizationId: 'o1',
          name: 'Bob',
          email: 'bob@opc.local',
          roleId: 'r1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update member when found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({ id: 'm1' });
      const updated = {
        id: 'm1',
        name: 'Alice',
        organization: { id: 'o1' },
        role: { id: 'r2' },
      };
      mockPrisma.member.update.mockResolvedValue(updated);

      const result = await service.update('m1', { roleId: 'r2', status: 'inactive' });

      expect(result).toEqual(updated);
      expect(mockPrisma.member.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'm1' },
          data: { roleId: 'r2', status: 'inactive' },
        }),
      );
    });

    it('should throw NotFoundException when member not found', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(service.update('m1', { status: 'inactive' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
