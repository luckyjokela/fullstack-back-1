// src/interfaces/controllers/admin.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { GetAllUserUseCase } from '../../application/useCases/getAllUser/GetAllUser.usecase';
import { AdminGuard } from '../../auth/guards/AdminGuards';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;

  const mockUser = {
    getIdValue: () => '123',
    getEmail: () => 'test@example.com',
    getUsername: () => 'testuser',
    getName: () => 'Test',
    getSurname: () => 'User',
    getMiddleName: () => 'Middle',
    getRole: () => 'admin',
  };

  const mockGetAllUserUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: [mockUser],
    }),
  };

  const mockAdminGuard = { canActivate: jest.fn().mockReturnValue(true) };
  const mockJwtAuthGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: GetAllUserUseCase,
          useValue: mockGetAllUserUseCase,
        },
        {
          provide: AdminGuard,
          useValue: mockAdminGuard,
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/users', () => {
    it('should return list of users', async () => {
      const result = await controller.getAllUsers();

      expect(result).toEqual([
        {
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
          name: 'Test',
          surname: 'User',
          middleName: 'Middle',
        },
      ]);

      expect(mockGetAllUserUseCase.execute).toHaveBeenCalled();
    });

    it('should throw HttpException if GetAllUserUseCase fails', async () => {
      mockGetAllUserUseCase.execute.mockResolvedValueOnce({
        success: false,
        error: 'Failed to fetch users',
      });

      await expect(controller.getAllUsers()).rejects.toThrow(
        new HttpException('Failed to fetch users', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('GET /admin/stats', () => {
    it('should return stats', () => {
      const result = controller.getStats();
      expect(result).toEqual({ usersCount: 100, activeUsers: 80 });
    });
  });
});
