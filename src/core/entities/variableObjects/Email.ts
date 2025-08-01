import { Result } from '../../shared/types/Result.type';
export class Email {
  constructor(private readonly value: string) {}

  static create(email: string): Result<Email> {
    if (!this.isValid(email)) {
      return { success: false, error: 'Invalid email' };
    }
    return { success: true, data: new Email(email) };
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
