import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../src/auth/strategies/JwtStrategy';
import { JwtAuthGuard } from '../src/auth/guards/JwtAuthGuard';
import { UserController } from '../src/interfaces/controllers/user.controller';
import { UserModule } from '../src/interfaces/modules/user.module';
import { CreateUserUseCase } from '../src/application/useCases/createUser/CreateUser.usecase';
import { GetUserUseCase } from '../src/application/useCases/getUser/GetUser.usecase';
import { UpdateUserUseCase } from '../src/application/useCases/updateUser/UpdateUser.usecase';
import { DeleteUserUseCase } from '../src/application/useCases/deleteUser/DeleteUser.usecase';
import { ChangeUserPasswordUseCase } from '../src/application/useCases/changePassword/ChangePasswordUser.usecase';
import { UserRepository } from '../src/infrastructure/persistence/typeorm/repositories/UserRepository';

describe('User (e2e) USER', () => {
  let app: INestApplication;

  const mockUser = {
    getIdValue: jest.fn().mockReturnValue('123'),
    getEmail: jest.fn().mockReturnValue('test@example.com'),
    getUsername: jest.fn().mockReturnValue('testuser'),
    getName: jest.fn().mockReturnValue('Test'),
    getSurname: jest.fn().mockReturnValue('User'),
    getMiddleName: jest.fn().mockReturnValue('Middle'),
    getPasswordValue: jest.fn().mockReturnValue('password123'),
  };

  const mockUserRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockCreateUserUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: {
        getIdValue: () => '123',
        getEmail: () => 'test@example.com',
        getUsername: () => 'testuser',
        getPasswordValue: () => 'password123',
        getName: () => 'Test',
        getSurname: () => 'User',
        getMiddleName: () => 'Middle',
      },
    }),
  };

  const mockGetUserUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: {
        getIdValue: () => '123',
        getEmail: () => 'test@example.com',
        getUsername: () => 'testuser',
        getName: () => 'Test',
        getSurname: () => 'User',
        getMiddleName: () => 'Middle',
      },
    }),
  };

  const mockUpdateUserUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: {
        getIdValue: () => '123',
        getEmail: () => 'updated@example.com',
        getUsername: () => 'updateduser',
        getPasswordValue: () => 'newpassword123',
        getName: () => 'Updated',
        getSurname: () => 'User',
        getMiddleName: () => 'Middle',
      },
    }),
  };

  const mockDeleteUserUseCase = {
    execute: jest.fn().mockResolvedValue({ success: true }),
  };

  const mockChangeUserPasswordUseCase = {
    execute: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'secret_key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: GetUserUseCase,
          useValue: mockGetUserUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
        },
        {
          provide: DeleteUserUseCase,
          useValue: mockDeleteUserUseCase,
        },
        {
          provide: ChangeUserPasswordUseCase,
          useValue: mockChangeUserPasswordUseCase,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        JwtStrategy,
        JwtAuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a user', () => {
      const dto = {
        id: '123',
        email: 'test@example.com',
        password: 'password$#@%bkgfoh123',
        username: 'testuser',
        name: 'Test',
        surname: 'User',
        middleName: 'Middle',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(dto)
        .expect(201)
        .expect({
          success: true,
          data: {
            id: '123',
            email: 'test@example.com',
            username: 'testuser',
          },
        });
    });
  });

  describe('Get /users/me', () => {
    it("should show a user info in user's panel", async () => {
      const token = app
        .get(JwtService)
        .sign({ sub: '123', email: 'test@example.com' });

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect({
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
          name: 'Test',
          surname: 'User',
          middleName: 'Middle',
        });
    });
  });

  describe('PATCH /users', () => {
    it('should update a user', () => {
      const token = app
        .get(JwtService)
        .sign({ sub: '123', email: 'test@example.com' });
      const dto = {
        id: '123',
        email: 'updated@example.com',
        password: 'newpassword%$#@542bgf123',
        username: 'updateduser',
        name: 'Updated',
        surname: 'User',
        middleName: 'Middle',
      };

      return request(app.getHttpServer())
        .patch('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200)
        .expect({
          success: true,
          data: {
            id: '123',
            email: 'updated@example.com',
            username: 'updateduser',
            name: 'Updated',
            surname: 'User',
            middleName: 'Middle',
          },
        });
    });
  });

  describe('PATCH /users/change-password', () => {
    it('should change password', async () => {
      const token = app
        .get(JwtService)
        .sign({ sub: '123', email: 'test@example.com' });
      const dto = { oldPassword: 'old', newPassword: 'new$#@%bkgfoh123' };

      return request(app.getHttpServer())
        .patch('/users/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(200)
        .expect({ success: true });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const token = app
        .get(JwtService)
        .sign({ sub: '123', email: 'test@example.com' });

      return request(app.getHttpServer())
        .delete('/users/123')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});
