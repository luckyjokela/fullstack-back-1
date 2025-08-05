// TODO Проверить на взлом password.ts и создать еще отдельно обновление пароля для пользователя
import { IPasswordHasher } from '../../../core/shared/interface/IPasswordHasher.interface';
import { Result } from '../../shared/types/Result.type';

export class Password {
  private readonly value: string;

  private constructor(hashedValue: string) {
    this.value = hashedValue;
  }

  static create(password: string, hasher: IPasswordHasher): Result<Password> {
    if (!password || password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one uppercase letter',
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one lowercase letter',
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one digit',
      };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one special character',
      };
    }
    const hashed = hasher.hash(password);
    return { success: true, data: new Password(hashed) };
  }

  static fromHash(hash: string): Result<Password> {
    if (!hash || typeof hash !== 'string') {
      return { success: false, error: 'Invalid password hash' };
    }
    return { success: true, data: new Password(hash) };
  }

  getValue(): string {
    return this.value;
  }
}
