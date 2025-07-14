import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { CreateUserUseCase } from 'src/application/useCases/createUser/CreateUser.usecase';
import { CreateUserDto } from 'src/application/useCases/createUser/CreateUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly useCase: CreateUserUseCase) {}

  @Post()
  async register(@Body() dto: CreateUserDto) {
    const result = await this.useCase.execute(
      dto.email,
      dto.password,
      dto.id,
      // dto.username,
      // dto.name,
      // dto.middleName,
      // dto.surname,
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      id: result.data.getId(),
      email: result.data.getEmail(),
      username: result.data.getUsername(),
    };
  }
}
