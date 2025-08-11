import { createHash, randomBytes } from 'crypto';

export class RefreshTokenWithExpiry {
  constructor(
    public readonly token: string,
    public readonly expiresAt: number,
    public readonly ip: string,
    public readonly userAgent: string,
    public readonly revoked: boolean = false,
  ) {}

  toJSON(): any {
    return {
      token: this.token,
      expiresAt: this.expiresAt,
      ip: this.ip,
      userAgent: this.userAgent,
      revoked: this.revoked,
    };
  }
}

export class RefreshToken {
  constructor(private readonly refreshTokens: RefreshTokenWithExpiry[] = []) {}

  generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  addRefreshToken(token: string, ip: string, userAgent: string): RefreshToken {
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const newToken = new RefreshTokenWithExpiry(
      token,
      expiresAt,
      ip,
      userAgent,
      false,
    );

    const newTokens = [...this.refreshTokens, newToken];
    return new RefreshToken(newTokens.slice(-5));
  }

  hasValidToken(token: string, ip: string, userAgent: string): boolean {
    const now = Date.now();
    return this.refreshTokens.some(
      (t) =>
        t.token === token &&
        t.expiresAt > now &&
        !t.revoked &&
        t.ip === ip &&
        t.userAgent === userAgent,
    );
  }

  revokeToken(token: string): RefreshToken {
    const hashedToken = this.hashToken(token);
    const newTokens = this.refreshTokens.map((t) =>
      t.token === hashedToken
        ? new RefreshTokenWithExpiry(
            t.token,
            t.expiresAt,
            t.ip,
            t.userAgent,
            true,
          )
        : t,
    );
    return new RefreshToken(newTokens);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getTokens(): RefreshTokenWithExpiry[] {
    return [...this.refreshTokens];
  }
}
