import { Id } from './variableObjects/IdGenerator';
import { Email } from './variableObjects/Email';
import { Password } from './variableObjects/Password';
import { Username, Name, MiddleName, Surname } from './variableObjects/UserBio';

export class User {
  constructor(
    private readonly id: Id,
    private readonly email: Email,
    private readonly password: Password,
    private readonly username: Username,
    private readonly name: Name,
    private readonly middleName: MiddleName,
    private readonly surname: Surname,
  ) {}
  getId(): Id {
    return this.id;
  }
  getIdValue(): string {
    return this.id.getValue();
  }
  getEmail(): string {
    return this.email.getValue();
  }
  getPassword(): Password {
    return this.password;
  }
  getPasswordValue(): string {
    return this.password.getValue();
  }
  getUsername(): string {
    return this.username.getValue();
  }
  getName(): string {
    return this.name?.getValue();
  }
  getSurname(): string {
    return this.surname?.getValue();
  }
  getMiddleName(): string {
    return this.middleName?.getValue();
  }
}
