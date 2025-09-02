import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Request,
  Response,
} from '@nestjs/common';
import { LoginUserDto } from '../../application/dtos/Login.dto';
import { AuthService } from '../../auth/services/auth.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { RegisterUserDto } from '../../application/dtos/Register.dto';
import { ConfirmEmailDto } from '../../application/dtos/ConfirmEmail.dto';
import { RefreshTokenDto } from '../../application/dtos/RefreshToken.dto';
import { IReq } from '../IReq/IRequest';
import { IRes } from '../IRes/IResponse';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const result = await this.createUserUseCase.execute(
      dto.id,
      dto.email,
      dto.password,
      dto.username,
      dto.name,
      dto.surname,
      dto.middleName,
    );

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      data: {
        id: result.data.getIdValue(),
        email: result.data.getEmail(),
        username: result.data.getUsername(),
      },
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 4, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginUserDto,
    @Request() req: IReq,
    @Response({ passthrough: true }) res: IRes,
  ) {
    const user = await this.authService.validateUser(dto.login, dto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const ip = req.ip ?? 'unknown';
    const userAgent = req.get('User-Agent') ?? 'unknown';

    const tokens = await this.authService.login(
      {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ip,
      userAgent,
    );

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return { success: true };
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() dto: ConfirmEmailDto) {
    return this.authService.confirmEmail(dto.token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto, @Request() req: IReq) {
    const { refreshToken } = dto;
    const ip = req.ip || '127.0.0.1';
    const userAgent = req.get('User-Agent') || 'test-agent';

    return this.authService.refreshToken(refreshToken, ip, userAgent);
  }
}
