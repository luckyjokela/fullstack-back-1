import { Result } from '../../shared/types/Result.type';
import { isEmail } from 'validator';
export class Email {
  constructor(private readonly value: string) {}

  static create(email: string): Result<Email> {
    if (!email || typeof email !== 'string') {
      return { success: false, error: 'Email is required' };
    }
    if (email.length > 254) {
      return { success: false, error: 'Email is too long' };
    }
    if (!this.isValid(email)) {
      return { success: false, error: 'Invalid email' };
    }

    return { success: true, data: new Email(email) };
  }

  private static isValid(email: string): boolean {
    return isEmail(email);
  }

  getValue(): string {
    return this.value;
  }
}
