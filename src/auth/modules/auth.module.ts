import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/JwtStrategy';
import { AuthService } from '../services/auth.service';
import { RefreshTokenUseCase } from '../../application/useCases/refreshToken/RefreshToken.usecase';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
import { USER_REPOSITORY_TOKEN } from '../../core/repositories/IUserRepository.interface';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    JwtStrategy,
    RefreshTokenUseCase,
    AuthService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
