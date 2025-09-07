import { USER_REPOSITORY_TOKEN } from '../src/core/repositories/IUserRepository.interface';
import { AuthController } from '../src/interfaces/controllers/auth.controller';
import { AuthModule } from '../src/auth/modules/auth.module';
import { RefreshTokenUseCase } from '../src/application/useCases/refreshToken/RefreshToken.usecase';
import { AuthService } from '../src/auth/services/auth.service';
import { JwtAuthGuard } from '../src/auth/guards/JwtAuthGuard';
import { JwtStrategy } from '../src/auth/strategies/JwtStrategy';
import { I_PASSWORD_HASHER_TOKEN } from '../src/core/shared/interface/IPasswordHasher.interface';
import { CreateUserUseCase } from '../src/application/useCases/createUser/CreateUser.usecase';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const hashedPassword = bcrypt.hashSync('password123', 10);

  const mockUser = {
    getIdValue: jest.fn().mockReturnValue('123'),
    getEmail: jest.fn().mockReturnValue('test@example.com'),
    getUsername: jest.fn().mockReturnValue('testuser'),
    getPasswordValue: jest.fn().mockReturnValue(hashedPassword),
    getRole: jest.fn().mockReturnValue('user'),
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
    compare: jest.fn().mockImplementation((plainText) => {
      return plainText === 'password123';
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: RefreshTokenUseCase,
          useValue: mockRefreshTokenService,
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: I_PASSWORD_HASHER_TOKEN,
          useValue: mockBcryptPasswordHasher,
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<INestApplication>();
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
        login: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(200)
        .expect((res) => {
          expect(res.headers['set-cookie']).toBeDefined();
        });

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      expect(mockRefreshTokenService.generateToken).toHaveBeenCalled();
      expect(mockRefreshTokenService.hashToken).toHaveBeenCalledWith(
        'refresh-token-123',
      );
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
        login: 'invalid@example.com',
        password: 'wrong-password',
        role: 'user',
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

      mockUserRepository.findByRefreshToken.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });
});
