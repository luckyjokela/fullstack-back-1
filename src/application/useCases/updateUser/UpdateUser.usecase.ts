import { Result } from 'src/core/shared/types/Result.type';
import { User } from 'src/core/entities/User';
import { IUserRepository } from 'src/core/repositories/IUserRepository.interface';
import { Email } from 'src/core/entities/variableObjects/Email';
import { BcryptPasswordHasher } from 'src/infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';
import { getAppErrorMessage } from 'src/core/shared/errors/AppError';
import {
  Username,
  Name,
  MiddleName,
  Surname,
} from 'src/core/entities/variableObjects/UserBio';

export class UpdateUserUseCase {
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    id: string,
    email: string,
    username: string,
    name: string,
    middleName: string,
    surname: string,
  ): Promise<Result<User>> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }

      const emailOrError = Email.create(email);
      const usernameOrError = Username.create(username);
      const nameOrError = Name.create(name);
      const surnameOrError = Surname.create(surname);
      const middleNameOrError = MiddleName.create(middleName);

      if (!emailOrError.success) {
        return { success: false, error: emailOrError.error };
      }
      if (!usernameOrError.success) {
        return { success: false, error: usernameOrError.error };
      }
      if (!nameOrError.success) {
        return { success: false, error: nameOrError.error };
      }
      if (!surnameOrError.success) {
        return { success: false, error: surnameOrError.error };
      }
      if (!middleNameOrError.success) {
        return { success: false, error: middleNameOrError.error };
      }

      const updatedUser = new User(
        existingUser.getId(),
        emailOrError.data,
        existingUser.getPassword(),
        usernameOrError.data,
        nameOrError.data,
        middleNameOrError.data,
        surnameOrError.data,
      );

      await this.userRepository.save(updatedUser);

      return { success: true, data: updatedUser };
    } catch (error: unknown) {
      return { success: false, error: getAppErrorMessage(error) };
    }
  }
}
