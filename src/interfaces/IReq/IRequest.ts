import { Request } from 'express';

export interface IReq extends Request {
  user: {
    userId: string;
    email: string;
  };
}
