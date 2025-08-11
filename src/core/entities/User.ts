import { Id } from './variableObjects/IdGenerator';
import { Email } from './variableObjects/Email';
import { Password } from './variableObjects/Password';
import { Username, Name, MiddleName, Surname } from './variableObjects/UserBio';
import {
  RefreshToken,
  RefreshTokenWithExpiry,
} from './variableObjects/RefreshToken';

export class User {
  getTokens(): RefreshToken {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly id: Id,
    private readonly email: Email,
    private readonly password: Password,
    private readonly username: Username,
    private readonly name: Name,
    private readonly middleName: MiddleName,
    private readonly surname: Surname,
    private readonly refreshToken?: RefreshToken,
  ) {}
  getId(): Id {
    return this.id;
  }
  getIdValue(): string {
    return this.id.getValue();
  }
  getPassword(): Password {
    return this.password;
  }
  getPasswordValue(): string {
    return this.password.getValue();
  }
  getEmail(): string {
    return this.email.getValue();
  }
  getEmailObj(): Email {
    return this.email;
  }
  getUsername(): string {
    return this.username.getValue();
  }
  getUsernameObj(): Username {
    return this.username;
  }
  getName(): string {
    return this.name.getValue();
  }
  getNameObj(): Name {
    return this.name;
  }
  getSurname(): string {
    return this.surname.getValue();
  }
  getSurnameObj(): Surname {
    return this.surname;
  }
  getMiddleName(): string {
    return this.middleName.getValue();
  }
  getMiddleNameObj(): MiddleName {
    return this.middleName;
  }
  getRefreshToken(): RefreshTokenWithExpiry[] {
    return this.refreshToken?.getTokens() ?? [];
  }
  hasValidRefreshToken(token: string, ip: string, userAgent: string): boolean {
    return this.refreshToken?.hasValidToken(token, ip, userAgent) ?? false;
  }
}
