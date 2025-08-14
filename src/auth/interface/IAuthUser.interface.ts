export interface IAuthUser {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}
