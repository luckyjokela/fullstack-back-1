import { User } from 'src/core/user/entities/User.entity';
import { IUserRepository } from 'src/core/user/repositories/IUserRepository.interface';
import { UserEntity } from '../../typeorm/entities/UserEntity';
import { AppDataSource } from '../../typeorm/data-source';

export class UserRepository implements IUserRepository {
  private readonly repository = AppDataSource.getRepository(UserEntity);

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.id.getValue();
    entity.email = user.email.getValue();
    entity.password = user.password.getValue();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;

    return new User(
      new Id(entity.id),
      new Email(entity.email),
      new Password(entity.password)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;

    return new User(
      new Id(entity.id),
      new Email(entity.email),
      new Password(entity.password)
    );
  }
}