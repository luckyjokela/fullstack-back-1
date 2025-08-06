import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/CreateUser.dto';
import { ChangePasswordDto } from '../../application/dtos/ChangePassword.dto';
import { UpdateUserDto } from '../../application/dtos/UpdateUser.dto';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { Result } from '../../core/shared/types/Result.type';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';

@Controller('users')
export class UserController {
  changeUserPasswordUseCase: any;
  constructor(
    private readonly CreateUseCase: CreateUserUseCase,
    private readonly UpdateUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  async makeUser(
    @Body() dto: CreateUserDto,
  ): Promise<Result<{ id: string; email: string; username: string }>> {
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
  async updateUser(@Body() dto: UpdateUserDto): Promise<
    Result<{
      id: string;
      email: string;
      username: string;
      name: string;
      surname: string;
      middleName: string;
    }>
  > {
    const result = await this.UpdateUseCase.execute(
      dto.id,
      dto.email,
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
        name: result.data.getName(),
        surname: result.data.getSurname(),
        middleName: result.data.getMiddleName(),
      },
    };
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() dto: ChangePasswordDto, @Request(): req) {
    const result = await this.changeUserPasswordUseCase.execute(
      req.user.userId,
      dto.oldPassword,
      dto.newPassword,
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { success: true };
  }
}
