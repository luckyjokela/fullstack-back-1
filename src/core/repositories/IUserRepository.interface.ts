import { User } from '../entities/User';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
  addRefreshToken(
    userId: string,
    token: string,
    ip: string,
    userAgent: string,
  ): Promise<void>;
  findByRefreshToken(token: string): Promise<User | null>;
  hasValidRefreshToken(
    token: string,
    ip: string,
    userAgent: string,
  ): Promise<boolean>;
  findByConfirmationToken(token: string): Promise<User | null>;
  updateEmailConfirmation(userId: string, token: string): Promise<void>;
}

export const USER_REPOSITORY_TOKEN = Symbol('I_USER_REPOSITORY');
