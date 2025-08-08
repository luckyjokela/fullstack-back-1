import { Result } from 'src/core/shared/types/Result.type';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../../core/repositories/IUserRepository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<Result<void>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await this.userRepository.delete(id);
    return { success: true, data: undefined };
  }
}
