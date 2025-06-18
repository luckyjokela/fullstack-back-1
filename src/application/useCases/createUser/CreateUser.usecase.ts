import { Result } from 'src/core/shared/types/Result.type';
import { User } from 'src/core/user/entities/User.entity';
import { IUserRepository } from 'src/core/user/repositories/IUserRepository.interface';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<Result<User>> {
    try {
      const user = new User(new Id(), new Email(email), new Password(password));
      await this.userRepository.save(user);
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}