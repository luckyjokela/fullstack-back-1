import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
  Patch,
} from '@nestjs/common';

import { AppService } from '../services/app.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { CreateUserDto } from '../../application/useCases/createUser/CreateUser.dto';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { UpdateUserDto } from '../../application/useCases/updateUser/UpdateUser.dto';
import { Result } from '../../core/shared/types/Result.type';

@Controller('users')
export class AppController {
  constructor(
    private readonly CreateUseCase: CreateUserUseCase,
    private readonly UpdateUseCase: UpdateUserUseCase,
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
    const result = await this.CreateUseCase.execute(
      dto.id,
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
        id: result.data.getIdValue(),
        email: result.data.getEmail(),
        username: result.data.getUsername(),
      },
    };
  }

  @Patch()
  async update(@Body() dto: UpdateUserDto): Promise<
    Result<{
      id: string;
      email: string;
      username: string;
      password: string;
      name: string;
      surname: string;
      middleName: string;
    }>
  > {
    const result = await this.UpdateUseCase.execute(
      dto.id,
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
        id: result.data.getIdValue(),
        email: result.data.getEmail(),
        username: result.data.getUsername(),
        password: result.data.getPasswordValue(),
        name: result.data.getName(),
        surname: result.data.getSurname(),
        middleName: result.data.getMiddleName(),
      },
    };
  }
}
