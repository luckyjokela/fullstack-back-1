export class LoginUserDto {
  login!: string;
  password!: string;
}

export class ValidateUserDto {
  userId!: string;
  email!: string;
  username!: string;
}
