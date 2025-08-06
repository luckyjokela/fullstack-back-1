import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { JwtStrategy } from '../../auth/strategies/JwtStrategy';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: UserRepository,
    },
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class UserModule {}
