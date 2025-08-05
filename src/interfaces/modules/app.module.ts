import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { JwtStrategy } from '../../auth/strategies/JwtStrategy';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule {}
