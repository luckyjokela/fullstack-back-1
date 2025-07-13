export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) throw new Error('Invalid email');
  }

  private isValid(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
