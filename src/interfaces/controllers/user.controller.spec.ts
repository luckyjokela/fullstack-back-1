import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { AppService } from '../services/app.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';

describe('UserController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    userController = app.get<UserController>(UserController);
  });
});
