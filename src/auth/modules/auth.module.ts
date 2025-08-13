import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategies/JwtStrategy';
import { AuthService } from '../services/auth.service';
import { RefreshTokenUseCase } from '../../application/useCases/refreshToken/RefreshToken.usecase';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';
import { I_PASSWORD_HASHER_TOKEN } from '../../core/shared/interface/IPasswordHasher.interface';
import { BcryptPasswordHasher } from '../../infrastructure/services/BcryptPasswordHasher';
import { USER_REPOSITORY_TOKEN } from '../../core/repositories/IUserRepository.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    RefreshTokenUseCase,
    AuthService,
    {
      provide: I_PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
