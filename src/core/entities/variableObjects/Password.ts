import { IPasswordHasher } from '../../../core/shared/interface/IPasswordHasher.interface';
import { Result } from '../../shared/types/Result.type';
import * as zxcvbn from 'zxcvbn';

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

    const result = zxcvbn(password);

    if (result.score < 3) {
      return { success: false, error: 'Password is too weak' };
    }

    const hashed = hasher.hash(password);
    return { success: true, data: new Password(hashed) };
  }

  static fromHash(hash: string): Result<Password> {
    const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53,}$/;
    if (!hash || typeof hash !== 'string' || !bcryptRegex.test(hash)) {
      return { success: false, error: 'Invalid password hash' };
    }
    return { success: true, data: new Password(hash) };
  }

  getValue(): string {
    return this.value;
  }
}
