import { Id } from './variableObjects/Id';
import { Email } from './variableObjects/Email';
import { Password } from './variableObjects/Password';
import { Username, Name, MiddleName, Surname } from './variableObjects/Bio';

export class User {
  constructor(
    private readonly id: Id,
    private readonly email: Email,
    private readonly password: Password,
    private readonly username: Username,
    private readonly name?: Name,
    private readonly middleName?: MiddleName,
    private readonly surname?: Surname,
  ) {}
  getId(): string {
    return this.id.getValue();
  }
  getEmail(): string {
    return this.email.getValue();
  }
  getPassword(): string {
    return this.password.getValue();
  }
  getUsername(): string {
    return this.username.getValue();
  }
}
