import { Result } from 'src/core/shared/types/Result.type';
import { User } from 'src/core/entities/User';
import { IUserRepository } from 'src/core/repositories/IUserRepository.interface';
import { Email } from 'src/core/entities/variableObjects/Email';
import { Id } from 'src/core/entities/variableObjects/Id';
import { Password } from 'src/core/entities/variableObjects/Password';
import { BcryptPasswordHasher } from 'src/infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';
import { getAppErrorMessage } from 'src/core/shared/errors/AppError';

export class CreateUserUseCase {
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<Result<User>> {
    try {
      const user = new User(
        new Id(),
        new Email(email),
        new Password(password, this.hasher),
      );
      await this.userRepository.save(user);
      return { success: true, data: user };
    } catch (error: unknown) {
      return { success: false, error: getAppErrorMessage(error) };
    }
  }
}
