import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminGuard } from '../../auth/guards/AdminGuards';
import { GetAllUserUseCase } from '../../application/useCases/getAllUser/GetAllUser.usecase';

@Controller('admin')
export class AdminController {
  constructor(private readonly getAllUserUseCase: GetAllUserUseCase) {}

  @Get('users')
  @UseGuards(AdminGuard)
  async getAllUsers() {
    const result = await this.getAllUserUseCase.execute();

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.data.map((user) => ({
      id: user.getIdValue(),
      email: user.getEmail(),
      username: user.getUsername(),
      name: user.getName(),
      surname: user.getSurname(),
      middleName: user.getMiddleName(),
    }));
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  getStats() {
    return { usersCount: 100, activeUsers: 80 };
  }
}
