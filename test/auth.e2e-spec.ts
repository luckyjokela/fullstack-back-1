/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { USER_REPOSITORY_TOKEN } from '../src/core/repositories/IUserRepository.interface';
import { AuthController } from '../src/interfaces/controllers/auth.controller';
import { AuthModule } from '../src/auth/modules/auth.module';
import { RefreshTokenUseCase } from '../src/application/useCases/refreshToken/RefreshToken.usecase';
import { AuthService } from '../src/auth/services/auth.service';
import { JwtAuthGuard } from '../src/auth/guards/JwtAuthGuard';
import { JwtStrategy } from '../src/auth/strategies/JwtStrategy';
import { BcryptPasswordHasher } from '../src/infrastructure/services/BcryptPasswordHasher';
import { CreateUserUseCase } from '../src/application/useCases/createUser/CreateUser.usecase';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    getIdValue: jest.fn().mockReturnValue('123'),
    getEmail: jest.fn().mockReturnValue('test@example.com'),
    getUsername: jest.fn().mockReturnValue('testuser'),
    getPasswordValue: jest.fn().mockReturnValue('hashed_password123'),
    hasValidRefreshToken: jest.fn().mockReturnValue(true),
  };

  const mockUserRepository = {
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    findByUsername: jest.fn().mockResolvedValue(null),
    addRefreshToken: jest.fn().mockResolvedValue(undefined),
    findByRefreshToken: jest.fn().mockResolvedValue(mockUser),
  };

  const mockRefreshTokenService = {
    generateToken: jest.fn().mockReturnValue('refresh-token-123'),
    hashToken: jest.fn().mockImplementation((token) => `hashed-${token}`),
  };

  const mockCreateUserUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: mockUser,
    }),
  };

  const mockBcryptPasswordHasher = {
    compare: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
        {
          provide: RefreshTokenUseCase,
          useValue: mockRefreshTokenService,
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: BcryptPasswordHasher,
          useValue: mockBcryptPasswordHasher,
        },
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /auth/login', () => {
    it('should login user and return tokens', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      expect(mockRefreshTokenService.generateToken).toHaveBeenCalled();
      expect(mockRefreshTokenService.hashToken).toHaveBeenCalledWith('refresh-token-123');
      expect(mockUserRepository.addRefreshToken).toHaveBeenCalledWith(
        '123',
        'hashed-refresh-token-123',
        expect.any(String),
        expect.any(String),
      );
    });

    it('should return 401 for invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);

      const dto = {
        email: 'invalid@example.com',
        password: 'wrong-password',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'valid-refresh-token';
      const hashedToken = mockRefreshTokenService.hashToken(refreshToken);

      mockUserRepository.findByRefreshToken.mockResolvedValue(mockUser);
      mockUser.hasValidRefreshToken.mockReturnValue(true);

      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';
      const hashedToken = mockRefreshTokenService.hashToken(refreshToken);

      mockUserRepository.findByRefreshToken.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });
});
