import { Result } from 'src/core/shared/types/Result.type';
import { User } from 'src/core/user/entities/User.entity';
import { IUserRepository } from 'src/core/user/repositories/IUserRepository.interface';
import { Email } from 'src/core/user/valueObjects/Email.vo';
import { Id } from 'src/core/user/valueObjects/Id.vo';
import { Password } from 'src/core/user/valueObjects/Password.vo';
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
