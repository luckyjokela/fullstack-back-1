import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { UserController } from '../src/interfaces/controllers/user.controller';
import { CreateUserUseCase } from '../src/application/useCases/createUser/CreateUser.usecase';
import { INestApplication } from '@nestjs/common';

describe('UserController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              success: true,
              data: {
                id: { getValue: () => '1' },
                email: { getValue: () => 'john@example.com' },
              },
            }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST users → должен вернуть созданного пользователя', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'john@example.com', password: 'pass123' });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe('1');
    expect(response.body.email).toBe('john@example.com');
  });
});
