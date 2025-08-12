export interface IPasswordHasher {
  hash(password: string): string;
  compare(plainText: string, hashed: string): boolean;
}

export const I_PASSWORD_HASHER_TOKEN = Symbol('I_PASSWORD_HASHER_TOKEN');
