import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { GetUserUseCase } from '../../application/useCases/getUser/GetUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { DeleteUserUseCase } from '../../application/useCases/deleteUser/DeleteUser.usecase';
import { ChangeUserPasswordUseCase } from '../../application/useCases/changePassword/ChangePasswordUser.usecase';
import { USER_REPOSITORY_TOKEN } from '../../core/repositories/IUserRepository.interface';

describe('UserController', () => {
  let userController: UserController;

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
        getEmail: () => 'test@example.com',
        getUsername: () => 'testuser',
        getName: () => 'Test',
        getSurname: () => 'User',
        getMiddleName: () => 'Middle',
      },
    }),
  };

  const mockChangeUserPasswordUseCase = {
    execute: jest.fn().mockResolvedValue({ success: true }),
  };

  const mockDeleteUserUseCase = {
    execute: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
