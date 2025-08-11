import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { RefreshToken } from '../../../core/entities/variableObjects/RefreshToken';

@Injectable()
export class RefreshTokenUseCase {
  generateToken(): string {
    return randomBytes(64).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  validateToken(
    token: string,
    refreshToken: RefreshToken,
    ip: string,
    userAgent: string,
  ): boolean {
    return refreshToken.hasValidToken(token, ip, userAgent);
  }
}
