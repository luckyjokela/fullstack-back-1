import { User } from '../../../../core/entities/User';
import { IUserRepository } from '../../../../core/repositories/IUserRepository.interface';
import { UserEntity } from '../../typeorm/entities/UserEntity';
import { AppPostgreSQLDataSource } from '../data-source';
import { Id } from '../../../../core/entities/variableObjects/IdGenerator';
import { Email } from '../../../../core/entities/variableObjects/Email';
import { Password } from '../../../../core/entities/variableObjects/Password';
import { UserRoles } from '../../../../core/entities/variableObjects/Role.enum';
import { RefreshTokenWithExpiry } from '../../../../core/entities/variableObjects/RefreshToken';
import { BcryptPasswordHasher } from '../../../../infrastructure/services/BcryptPasswordHasher';
import { IPasswordHasher } from '../../../../core/shared/interface/IPasswordHasher.interface';
import {
  MiddleName,
  Name,
  Surname,
  Username,
} from '../../../../core/entities/variableObjects/UserBio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repository =
    AppPostgreSQLDataSource.getRepository(UserEntity);
  private readonly hasher: IPasswordHasher = new BcryptPasswordHasher();

  private entityToUser(entity: UserEntity): User | null {
    const idOrError = Id.fromString(entity.id);
    if (!idOrError.success) {
      console.error('Invalid id in DB:', entity.id);
      return null;
    }
    const UserId = idOrError.data;

    const emailOrError = Email.create(entity.email);
    if (!emailOrError.success) {
      console.error('Invalid email in DB:', entity.email);
      return null;
    }
    const emailVO = emailOrError.data;

    const passwordOrError = Password.fromHash(entity.password);
    if (!passwordOrError.success) {
      console.error('Invalid password hash in DB for user:', entity.id);
      return null;
    }
    const passwordVO = passwordOrError.data;

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

    const role = entity.role ?? UserRoles.USER;

    const isEmailConfirmed = entity.isEmailConfirmed ?? false;
    const confirmationToken = entity.confirmationToken || undefined;

    return new User(
      UserId,
      emailVO,
      passwordVO,
      usernameVO,
      nameVO,
      middleNameVO,
      UserSurname,
      role,
      isEmailConfirmed,
      confirmationToken,
    );
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    return this.entityToUser(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;
    return this.entityToUser(entity);
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ username });
    if (!entity) return null;
    return this.entityToUser(entity);
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities
      .map((entity) => this.entityToUser(entity))
      .filter((user): user is User => user !== null);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { confirmationToken: token },
    });
    if (!entity) return null;
    return this.entityToUser(entity);
  }

  async updateEmailConfirmation(userId: string, token: string): Promise<void> {
    const entity = await this.repository.findOneBy({ id: userId });
    if (!entity || entity.confirmationToken !== token) {
      throw new Error('Invalid confirmation token');
    }

    entity.isEmailConfirmed = true;
    entity.confirmationToken = undefined;

    await this.repository.save(entity);
  }

  async addRefreshToken(
    userId: string,
    hashedToken: string,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const entity = await this.repository.findOneBy({ id: userId });
    if (!entity) throw new Error('User not found');

    const refreshToken = new RefreshTokenWithExpiry(
      hashedToken,
      Date.now() + 7 * 24 * 60 * 60 * 1000,
      ip,
      userAgent,
      false,
    );

    entity.refreshTokens.push(refreshToken);
    await this.repository.save(entity);
  }

  async findByRefreshToken(hashedToken: string): Promise<User | null> {
    const entity = await this.repository
      .createQueryBuilder('user')
      .where(':token = ANY(user.refreshTokens)', { token: hashedToken })
      .getOne();

    if (!entity) return null;
    return this.entityToUser(entity);
  }

  async hasValidRefreshToken(
    token: string,
    ip: string,
    userAgent: string,
  ): Promise<boolean> {
    const entity = await this.repository
      .createQueryBuilder('user')
      .where(':token = ANY(user.refreshTokens)', { token })
      .getOne();

    if (!entity) return false;

    const user = this.entityToUser(entity);
    if (!user) return false;

    return user.hasValidRefreshToken(token, ip, userAgent);
  }

  async save(user: User): Promise<void> {
    const entity = new UserEntity();

    entity.id = user.getIdValue();
    entity.email = user.getEmail();
    entity.password = user.getPasswordValue();
    entity.username = user.getUsername();
    entity.name = user.getName();
    entity.middleName = user.getMiddleName();
    entity.surname = user.getSurname();
    entity.role = user.getRole();
    entity.isEmailConfirmed = user.getIsEmailConfirmed();
    entity.confirmationToken = user.getConfirmationToken();

    try {
      await this.repository.save(entity);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  }
}
