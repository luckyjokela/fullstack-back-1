import { Id } from '../valueObjects/Id.vo';
import { Email } from '../valueObjects/Email.vo';
import { Password } from '../valueObjects/Password.vo';

export class User {
  constructor(
    public readonly id: Id,
    public readonly email: Email,
    public readonly password: Password,
  ) {}
}
