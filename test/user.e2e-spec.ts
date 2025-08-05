/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/interfaces/modules/app.module';
import { AppController } from '../src/interfaces/controllers/app.controller';
import { AppService } from '../src/interfaces/services/app.service';
import { CreateUserUseCase } from '../src/application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../src/application/useCases/updateUser/UpdateUser.usecase';
import { UserRepository } from '../src/infrastructure/persistence/typeorm/repositories/UserRepository';

describe('User (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(null),
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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
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
        password: 'password123',
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

  describe('PATCH /users', () => {
    it('should update a user', () => {
      const dto = {
        id: '123',
        email: 'updated@example.com',
        password: 'newpassword123',
        username: 'updateduser',
        name: 'Updated',
        surname: 'User',
        middleName: 'Middle',
      };

      return request(app.getHttpServer())
        .patch('/users')
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
});
