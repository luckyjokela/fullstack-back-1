import { IPasswordHasher } from '../../core/shared/interface/IPasswordHasher.interface';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements IPasswordHasher {
  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  compare(plainText: string, hashed: string): boolean {
    return bcrypt.compareSync(plainText, hashed);
  }
}
