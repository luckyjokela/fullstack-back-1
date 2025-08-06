export class LoginUserDto {
  email!: string;
  username!: string;
  password!: string;
}

export class ValidateUserDto {
  userId!: string;
  email!: string;
  username!: string;
}
