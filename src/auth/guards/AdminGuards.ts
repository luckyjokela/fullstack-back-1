import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './JwtAuthGuard';
import { IAuthUser } from '../interface/IAuthUser.interface';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    const canActivate = super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest<{ user: IAuthUser }>();
    const user = request.user;
    return user.role === 'admin';
  }
}
