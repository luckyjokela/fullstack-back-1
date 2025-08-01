import { User } from 'src/core/entities/User';
import { IUserRepository } from 'src/core/repositories/IUserRepository.interface';
import { UserEntity } from '../../typeorm/entities/UserEntity';
import { AppPostgreSQLDataSource } from '../data-source';
import { Id } from 'src/core/entities/variableObjects/IdGenerator';
import { Email } from 'src/core/entities/variableObjects/Email';
import { Password } from 'src/core/entities/variableObjects/Password';
import { BcryptPasswordHasher } from 'src/infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';
import {
  MiddleName,
  Name,
  Surname,
  Username,
} from 'src/core/entities/variableObjects/UserBio';

export class UserRepository implements IUserRepository {
  private readonly repository =
    AppPostgreSQLDataSource.getRepository(UserEntity);
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.getIdValue();
    entity.email = user.getEmail();
    entity.password = user.getPasswordValue();
    entity.username = user.getUsername();
    entity.name = user.getName();
    entity.middleName = user.getMiddleName();
    entity.surname = user.getUsername();

    if (user.getUsername()) {
      entity.username = user.getUsername();
    }

    if (user.getName()) {
      entity.name = user.getName();
    }

    if (user.getSurname()) {
      entity.surname = user.getSurname();
    }

    if (user.getMiddleName()) {
      entity.middleName = user.getMiddleName();
    }

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;

    const idOrError = Id.fromString(entity.id);
    if (!idOrError.success) {
      console.error('Invalid email in DB:', entity.id);
      return null;
    }
    const UserId = idOrError.data;

    const emailOrError = Email.create(entity.email);
    if (!emailOrError.success) {
      console.error('Invalid email in DB:', entity.email);
      return null;
    }
    const UserEmail = emailOrError.data;

    const passwordOrError = Password.fromHash(entity.password);
    if (!passwordOrError.success) {
      console.error('Invalid password hash in DB');
      return null;
    }
    const UserPassword = passwordOrError.data;

    const usernameOrError = Username.create(entity.username);
    if (!usernameOrError.success) return null;
    const usernameVO = usernameOrError.data;

    const nameOrError = Name.create(entity.name);
    if (!nameOrError.success) return null;
    const nameVO = nameOrError.data;

    const surnameOrError = Surname.create(entity.surname);
    if (!surnameOrError.success) return null;
    const UserSurname = surnameOrError.data;

    const middleNameOrError = MiddleName.create(entity.middleName);
    if (!middleNameOrError.success) return null;
    const middleNameVO = middleNameOrError.data;

    return new User(
      UserId,
      UserEmail,
      UserPassword,
      usernameVO,
      nameVO,
      middleNameVO,
      UserSurname,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;

    const idOrError = Id.fromString(entity.id);
    if (!idOrError.success) {
      console.error('Invalid email in DB:', entity.id);
      return null;
    }
    const UserId = idOrError.data;

    const emailOrError = Email.create(entity.email);
    if (!emailOrError.success) {
      console.error('Invalid email in DB:', entity.email);
      return null;
    }
    const UserEmail = emailOrError.data;

    const passwordOrError = Password.fromHash(entity.password);
    if (!passwordOrError.success) {
      console.error('Invalid password hash in DB');
      return null;
    }
    const UserPassword = passwordOrError.data;

    const usernameOrError = Username.create(entity.username);
    if (!usernameOrError.success) return null;
    const usernameVO = usernameOrError.data;

    const nameOrError = Name.create(entity.name);
    if (!nameOrError.success) return null;
    const nameVO = nameOrError.data;

    const surnameOrError = Surname.create(entity.surname);
    if (!surnameOrError.success) return null;
    const UserSurname = surnameOrError.data;

    const middleNameOrError = MiddleName.create(entity.middleName);
    if (!middleNameOrError.success) return null;
    const middleNameVO = middleNameOrError.data;

    return new User(
      UserId,
      UserEmail,
      UserPassword,
      usernameVO,
      nameVO,
      middleNameVO,
      UserSurname,
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ username });
    if (!entity) return null;

    const idOrError = Id.fromString(entity.id);
    if (!idOrError.success) {
      console.error('Invalid email in DB:', entity.id);
      return null;
    }
    const UserId = idOrError.data;

    const emailOrError = Email.create(entity.email);
    if (!emailOrError.success) {
      console.error('Invalid email in DB:', entity.email);
      return null;
    }
    const UserEmail = emailOrError.data;

    const passwordOrError = Password.fromHash(entity.password);
    if (!passwordOrError.success) {
      console.error('Invalid password hash in DB');
      return null;
    }
    const UserPassword = passwordOrError.data;

    const usernameOrError = Username.create(entity.username);
    if (!usernameOrError.success) return null;
    const usernameVO = usernameOrError.data;

    const nameOrError = Name.create(entity.name);
    if (!nameOrError.success) return null;
    const nameVO = nameOrError.data;

    const surnameOrError = Surname.create(entity.surname);
    if (!surnameOrError.success) return null;
    const UserSurname = surnameOrError.data;

    const middleNameOrError = MiddleName.create(entity.middleName);
    if (!middleNameOrError.success) return null;
    const middleNameVO = middleNameOrError.data;

    return new User(
      UserId,
      UserEmail,
      UserPassword,
      usernameVO,
      nameVO,
      middleNameVO,
      UserSurname,
    );
  }
}
