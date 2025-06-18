import bcrypt from 'bcrypt';
import { IPasswordHasher } from 'src/core/shared/interface/IPasswordHasher.interface';

export class BcryptPasswordHasher implements IPasswordHasher {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  compare(plainText: string, hashed: string): boolean {
    return bcrypt.compareSync(plainText, hashed);
  }
}