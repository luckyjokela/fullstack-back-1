import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../core/repositories/IUserRepository.interface';
import { Password } from '../../core/entities/variableObjects/Password';
import { BcryptPasswordHasher } from '../../infrastructure/services/BcryptPasswordHasher';
import { ValidateUserDto } from '../../application/dtos/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  login(user: { userId: string; email: string }) {
    const payload = { sub: user.userId, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(
    email: string,
    username: string,
    password: string,
  ): Promise<ValidateUserDto | null> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = await this.userRepository.findByUsername(username);
    }
    if (user) {
      const passwordVO = Password.fromHash(user.getPasswordValue());
      if (
        passwordVO.success &&
        this.comparePassword(password, user.getPasswordValue())
      ) {
        return {
          userId: user.getIdValue(),
          email: user.getEmail(),
          username: user.getUsername(),
        };
      }
    }
    return null;
  }

  private comparePassword(plainText: string, hashed: string): boolean {
    return new BcryptPasswordHasher().compare(plainText, hashed);
  }
}
