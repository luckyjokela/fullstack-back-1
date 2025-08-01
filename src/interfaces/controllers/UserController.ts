import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { CreateUserUseCase } from 'src/application/useCases/createUser/CreateUser.usecase';
import { CreateUserDto } from 'src/application/useCases/createUser/CreateUser.dto';
import { Result } from 'src/core/shared/types/Result.type';

@Controller('users')
export class UserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  async register(@Body() dto: CreateUserDto): Promise<
    Result<{
      id: string;
      email: string;
      username: string;
      name: string;
      middleName: string;
      surname: string;
    }>
  > {
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
        name: result.data.getName(),
        middleName: result.data.getMiddleName(),
        surname: result.data.getSurname(),
      },
    };
  }
}
