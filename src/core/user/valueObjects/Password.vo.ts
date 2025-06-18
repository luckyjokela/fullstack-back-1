import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';

export class Password {
  constructor(
    private readonly value: string,
    private readonly hasher: IPasswordHasher,
  ) {}

  static create(raw: string, hasher: IPasswordHasher): Password {
    if (raw.length < 8) {
      throw new Error('Password too short');
    }
    const hashed = hasher.hash(raw);
    return new Password(hashed, hasher);
  }

  compare(plainText: string): boolean {
    return this.hasher.compare(plainText, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
