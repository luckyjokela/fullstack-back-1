import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';

export class Password {
  private readonly value: string;

  constructor(
    value: string,
    private readonly hasher: IPasswordHasher,
  ) {
    if (value.length < 8) {
      throw new Error('Password too short');
    }
    this.value = value;
  }

  static create(raw: string, hasher: IPasswordHasher): Password {
    if (raw.length < 8) {
      throw new Error('Password too short');
    }
    const hashed = hasher.hash(raw);
    return new Password(hashed, hasher);
  }

  getValue(): string {
    return this.value;
  }

  compare(plainText: string): boolean {
    return this.hasher.compare(plainText, this.value);
  }
}
