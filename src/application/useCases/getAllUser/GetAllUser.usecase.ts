import { Result } from '../../../core/shared/types/Result.type';
import { getAppErrorMessage } from '../../../core/shared/errors/AppError';
import { User } from '../../../core/entities/User';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../../core/repositories/IUserRepository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<Result<User[]>> {
    try {
      const users = await this.userRepository.findAll();
      return { success: true, data: users };
    } catch (error: unknown) {
      return { success: false, error: getAppErrorMessage(error) };
    }
  }
}
