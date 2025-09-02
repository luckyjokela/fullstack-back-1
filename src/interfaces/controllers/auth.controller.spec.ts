/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../auth/services/auth.service';
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUser.usecase';
import { LoginUserDto } from '../../application/dtos/Login.dto';
import { RefreshTokenDto } from '../../application/dtos/RefreshToken.dto';
import { IReq } from '../IReq/IRequest';
import { IRes } from '../IRes/IResponse';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let createUserUseCase: CreateUserUseCase;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockRequest: Partial<IReq> = {
    ip: '192.168.1.1',
    get: jest.fn().mockReturnValue('Mozilla/5.0'),
  };

  const mockResponse: Partial<IRes> = {
    cookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should call CreateUserUseCase.execute with correct parameters', async () => {
      const dto = {
        id: '123',
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        name: 'Test',
        surname: 'User',
        middleName: 'Middle',
      };

      const mockUser = {
        getIdValue: () => '123',
        getEmail: () => 'test@example.com',
        getUsername: () => 'testuser',
      };

      mockCreateUserUseCase.execute.mockResolvedValue({
        success: true,
        data: mockUser,
      });

      const result = await controller.register(dto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(
        dto.id,
        dto.email,
        dto.password,
        dto.username,
        dto.name,
        dto.surname,
        dto.middleName,
      );

      expect(result).toEqual({
        success: true,
        data: {
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
        },
      });
    });

    it('should throw HttpException if CreateUserUseCase fails', async () => {
      const dto = {
        id: '123',
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        name: 'Test',
        surname: 'User',
        middleName: 'Middle',
      };

      mockCreateUserUseCase.execute.mockResolvedValue({
        success: false,
        error: 'User already exists',
      });

      await expect(controller.register(dto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should return tokens if credentials are valid', async () => {
      const dto: LoginUserDto = {
        login: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        userId: '123',
        email: 'test@example.com',
        username: 'testuser',
      };

      const mockTokens = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(
        dto,
        mockRequest as IReq,
        mockResponse as IRes,
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        dto.login,
        dto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(
        mockUser,
        '192.168.1.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockTokens);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const dto: LoginUserDto = {
        login: 'invalid@example.com',
        password: 'wrong-password',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login(dto, mockRequest as IReq, mockResponse as IRes),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return new access token', async () => {
      const dto: RefreshTokenDto = {
        refreshToken: 'refresh-token-123',
      };

      const mockTokens = {
        access_token: 'new-access-token-123',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockTokens);

      const result = await controller.refresh(dto, mockRequest as IReq);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        dto.refreshToken,
        '192.168.1.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockTokens);
    });
  });
});
