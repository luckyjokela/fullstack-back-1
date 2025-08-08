import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { USER_REPOSITORY_TOKEN } from '../../core/repositories/IUserRepository.interface';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { GetUserUseCase } from '../../application/useCases/getUser/GetUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { DeleteUserUseCase } from '../../application/useCases/deleteUser/DeleteUser.usecase';
import { ChangeUserPasswordUseCase } from '../../application/useCases/changePassword/ChangePasswordUser.usecase';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    ChangeUserPasswordUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
