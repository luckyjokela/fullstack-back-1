import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        CreateUserUseCase,
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useClass: UserRepository,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello world"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
