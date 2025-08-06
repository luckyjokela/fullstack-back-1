import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/JwtStrategy';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../../infrastructure/persistence/typeorm/repositories/UserRepository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
