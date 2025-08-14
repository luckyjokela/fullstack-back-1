import { Module } from '@nestjs/common';
import { GetAllUserUseCase } from '../../application/useCases/getAllUser/GetAllUser.usecase';
import { USER_REPOSITORY_TOKEN } from '../../core/repositories/IUserRepository.interface';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
import { AdminController } from '../controllers/admin.controller';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    GetAllUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
})
export class AdminModule {}
