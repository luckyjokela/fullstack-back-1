import { Result } from '../../core/shared/types/Result.type';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { IReq } from '../IReq/IRequest';
import { CreateUserDto } from '../../application/dtos/CreateUser.dto';
import { UpdateUserDto } from '../../application/dtos/UpdateUser.dto';
import { ChangePasswordDto } from '../../application/dtos/ChangePassword.dto';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUser.usecase';
import { GetUserUseCase } from '../../application/useCases/getUser/GetUser.usecase';
import { DeleteUserUseCase } from '../../application/useCases/deleteUser/DeleteUser.usecase';
import { ChangeUserPasswordUseCase } from '../../application/useCases/changePassword/ChangePasswordUser.usecase';
import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly CreateUseCase: CreateUserUseCase,
    private readonly GetUserUseCase: GetUserUseCase,
    private readonly UpdateUseCase: UpdateUserUseCase,
    private readonly DeleteUserUseCase: DeleteUserUseCase,
    private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: IReq) {
    const result = await this.GetUserUseCase.execute(req.user.userId);

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return {
      id: result.data.getIdValue(),
      email: result.data.getEmail(),
      username: result.data.getUsername(),
      name: result.data.getName(),
      surname: result.data.getSurname(),
      middleName: result.data.getMiddleName(),
      role: result.data.getRole(),
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
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
  async changePassword(@Body() dto: ChangePasswordDto, @Request() req: IReq) {
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Request() req: IReq) {
    if (req.user.userId !== id) {
      throw new HttpException(
        'You can only delete your own account',
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.DeleteUserUseCase.execute(id);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return { success: true, data: undefined };
  }
}
