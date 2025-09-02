import { Response } from 'express';

export interface IRes extends Response {
  user: {
    userId: string;
    email: string;
  };
  cookies?: { [key: string]: string };
}
