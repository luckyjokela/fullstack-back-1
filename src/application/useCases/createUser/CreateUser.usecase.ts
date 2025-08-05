import { Result } from '../../../core/shared/types/Result.type';
import { User } from '../../../core/entities/User';
import { IUserRepository } from '../../../core/repositories/IUserRepository.interface';
import { Email } from '../../../core/entities/variableObjects/Email';
import { Id } from '../../../core/entities/variableObjects/IdGenerator';
import { Password } from '../../../core/entities/variableObjects/Password';
import { BcryptPasswordHasher } from '../../../infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from '../../../core/shared/interface/IPasswordHasher.interface';
import { getAppErrorMessage } from '../../../core/shared/errors/AppError';
import {
  MiddleName,
  Name,
  Surname,
  Username,
} from '../../../core/entities/variableObjects/UserBio';
import { UserRepository } from '../../../infrastructure/persistence/typeorm/repositories/UserRepository';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    id: string,
    email: string,
    password: string,
    username: string,
    name: string,
    surname: string,
    middleName: string,
  ): Promise<Result<User>> {
    try {
      const idOrError = Id.create();
      if (!idOrError.success) {
        return { success: false, error: idOrError.error };
      }
      const id = idOrError.data;

      const emailOrError = Email.create(email);
      if (!emailOrError.success) {
        return { success: false, error: emailOrError.error };
      }
      const emailVO: Email = emailOrError.data;

      const passwordOrError = Password.create(password, this.hasher);
      if (!passwordOrError.success) {
        return { success: false, error: passwordOrError.error };
      }
      const passwordVO: Password = passwordOrError.data;

      const usernameOrError = Username.create(username);
      if (!usernameOrError.success) {
        return { success: false, error: usernameOrError.error };
      }
      const usernameVO: Username = usernameOrError.data;

      const nameOrError = Name.create(name);
      if (!nameOrError.success) {
        return { success: false, error: nameOrError.error };
      }
      const nameVO: Name = nameOrError.data;

      const surnameOrError = Surname.create(surname);
      if (!surnameOrError.success) {
        return { success: false, error: surnameOrError.error };
      }
      const surnameVO: Surname = surnameOrError.data;

      const middleNameOrError = MiddleName.create(middleName);
      if (!middleNameOrError.success) {
        return { success: false, error: middleNameOrError.error };
      }
      const middleNameVO: MiddleName = middleNameOrError.data;

      const user = new User(
        id,
        emailVO,
        passwordVO,
        usernameVO,
        nameVO,
        middleNameVO,
        surnameVO,
      );

      await this.userRepository.save(user);

      return { success: true, data: user };
    } catch (error: unknown) {
      return { success: false, error: getAppErrorMessage(error) };
    }
  }
}
