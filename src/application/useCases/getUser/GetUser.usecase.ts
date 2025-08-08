import { Result } from '../../../core/shared/types/Result.type';
import { User } from '../../../core/entities/User';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../../core/repositories/IUserRepository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<Result<User>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    return { success: true, data: user };
  }
}
