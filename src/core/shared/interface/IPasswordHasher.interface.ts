export interface IPasswordHasher {
  hash(password: string): string;
  compare(plainText: string, hashed: string): boolean;
}
