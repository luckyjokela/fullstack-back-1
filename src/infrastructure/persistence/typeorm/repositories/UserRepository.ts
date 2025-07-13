import { User } from 'src/core/entities/User';
import { IUserRepository } from 'src/core/repositories/IUserRepository.interface';
import { UserEntity } from '../../typeorm/entities/UserEntity';
import { AppDataSource } from '../data-source';
import { Id } from 'src/core/entities/variableObjects/Id';
import { Email } from 'src/core/entities/variableObjects/Email';
import { Password } from 'src/core/entities/variableObjects/Password';
import { BcryptPasswordHasher } from 'src/infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';
import { Username } from 'src/core/entities/variableObjects/Bio';

export class UserRepository implements IUserRepository {
  private readonly repository = AppDataSource.getRepository(UserEntity);
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.getId();
    entity.email = user.getEmail();
    entity.password = user.getPassword();
    entity.username = user.getUsername();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;

    return new User(
      new Id(entity.id),
      new Email(entity.email),
      new Password(entity.password, this.hasher),
      new Username(entity.username),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;

    return new User(
      new Id(entity.id),
      new Email(entity.email),
      new Password(entity.password, this.hasher),
      new Username(entity.username),
    );
  }

  async findByUsername(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;

    return new User(
      new Id(entity.id),
      new Email(entity.email),
      new Password(entity.password, this.hasher),
      new Username(entity.username),
    );
  }
}
