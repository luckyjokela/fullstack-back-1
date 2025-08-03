import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CreateUserUseCase, UpdateUserUseCase],
})
export class AppModule {}
