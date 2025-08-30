import { Result } from '../../core/shared/types/Result.type';
import { JwtService } from '@nestjs/jwt';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../core/repositories/IUserRepository.interface';
import { Password } from '../../core/entities/variableObjects/Password';
import { RefreshTokenUseCase } from '../../application/useCases/refreshToken/RefreshToken.usecase';
import { ValidateUserDto } from '../../application/dtos/Login.dto';
import {
  I_PASSWORD_HASHER_TOKEN,
  IPasswordHasher,
} from '../../core/shared/interface/IPasswordHasher.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenUseCase,
    @Inject(I_PASSWORD_HASHER_TOKEN)
    private readonly hasher: IPasswordHasher,
  ) {}

  async login(
    user: { userId: string; email: string; username: string; role: string },
    ip: string,
    userAgent: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.refreshTokenService.generateToken();

    const hashedToken = this.refreshTokenService.hashToken(refreshToken);
    await this.userRepository.addRefreshToken(
      user.userId,
      hashedToken,
      ip,
      userAgent,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async confirmEmail(token: string): Promise<Result<void>> {
    const user = await this.userRepository.findByConfirmationToken(token);
    if (!user) {
      return { success: false, error: 'Invalid or expired confirmation token' };
    }

    const confirmedUser = user.confirmEmail();

    try {
      await this.userRepository.save(confirmedUser);
      return { success: true, data: undefined };
    } catch {
      return { success: false, error: 'Failed to save user' };
    }
  }

  async refreshToken(
    refreshToken: string,
    ip: string,
    userAgent: string,
  ): Promise<{ access_token: string }> {
    const hashedToken = this.refreshTokenService.hashToken(refreshToken);
    const user = await this.userRepository.findByRefreshToken(hashedToken);

    if (!user || !user.hasValidRefreshToken(hashedToken, ip, userAgent)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.getIdValue(), email: user.getEmail() };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { access_token: accessToken };
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<ValidateUserDto | null> {
    let user = await this.userRepository.findByEmail(login);
    if (!user) {
      user = await this.userRepository.findByUsername(login);
    }
    if (user) {
      const passwordVO = Password.fromHash(user.getPasswordValue());
      if (!passwordVO.success) return null;

      if (this.hasher.compare(password, user.getPasswordValue())) {
        return {
          userId: user.getIdValue(),
          email: user.getEmail(),
          username: user.getUsername(),
          role: user.getRole(),
        };
      }
    }
    return null;
  }
}
