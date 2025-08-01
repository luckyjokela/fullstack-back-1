import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';

import { AppService } from '../services/app.service';
import { CreateUserUseCase } from 'src/application/useCases/createUser/CreateUser.usecase';
import { CreateUserDto } from 'src/application/useCases/createUser/CreateUser.dto';
import { Result } from 'src/core/shared/types/Result.type';

@Controller('users')
export class AppController {
  constructor(
    private readonly useCase: CreateUserUseCase,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async register(
    @Body() dto: CreateUserDto,
  ): Promise<Result<{ id: string; email: string; username: string | null }>> {
    const result = await this.useCase.execute(
      dto.email,
      dto.password,
      dto.username,
      dto.name,
      dto.surname,
      dto.middleName,
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      data: {
        id: result.data.getId(),
        email: result.data.getEmail(),
        username: result.data.getUsername(),
      },
    };
  }
}
