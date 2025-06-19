import { Id } from '../valueObjects/Id.vo';
import { Email } from '../valueObjects/Email.vo';
import { Password } from '../valueObjects/Password.vo';

export class User {
  getId(): any {
    throw new Error('Method not implemented.');
  }
  getEmail(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    public readonly id: Id,
    public readonly email: Email,
    public readonly password: Password,
  ) {}
}
