import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../core/repositories/IUserRepository.interface';
import { Password } from '../../../core/entities/variableObjects/Password';
import { IPasswordHasher } from '../../../core/shared/interface/IPasswordHasher.interface';
import { BcryptPasswordHasher } from '../../../infrastructure/services/BcryptPasswordHasher';
import { User } from '../../../core/entities/User';
import { Result } from '../../../core/shared/types/Result.type';

@Injectable()
export class ChangeUserPasswordUseCase {
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<Result<User>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValidOldPassword = this.hasher.compare(
      oldPassword,
      user.getPasswordValue(),
    );
    if (!isValidOldPassword) {
      return { success: false, error: 'Invalid old password' };
    }

    const newHashOrError = Password.create(newPassword, this.hasher);
    if (!newHashOrError.success) {
      return { success: false, error: newHashOrError.error };
    }

    const updatedUser = new User(
      user.getId(),
      user.getEmailObj(),
      newHashOrError.data,
      user.getUsernameObj(),
      user.getNameObj(),
      user.getMiddleNameObj(),
      user.getSurnameObj(),
    );

    await this.userRepository.save(updatedUser);

    return { success: true, data: updatedUser };
  }
}
