import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositoryFake } from '../../test/utils/repository';
import { TokensService } from './tokens.service';
import { TokenEntity } from './entities/token.entity';
import { UserEntity } from '../users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: TokensService;
  let repository: Repository<TokenEntity>;
  let jwtService: JwtService;
  let decodeTokenSpy: any;
  let generateTokensSpy: any;
  let saveRefreshTokenSpy: any;
  const tokens = {
    accessToken: 'ac',
    refreshToken: 'rt',
  };

  beforeAll(async () => {
    const RepositoryProvider = {
      provide: getRepositoryToken(TokenEntity),
      useClass: RepositoryFake,
    };

    const JwtServiceProvider = {
      provide: JwtService,
      useFactory: () => ({
        signAsync: jest.fn(),
        decode: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService, RepositoryProvider, ConfigService, JwtServiceProvider],
    }).compile();

    service = module.get<TokensService>(TokensService);
    repository = module.get(getRepositoryToken(TokenEntity));
    jwtService = module.get(JwtService);
    decodeTokenSpy = jest.spyOn(TokensService.prototype as any, 'decodeToken');
    generateTokensSpy = jest.spyOn(TokensService.prototype as any, 'generateTokens');
    saveRefreshTokenSpy = jest.spyOn(TokensService.prototype as any, 'saveRefreshToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeToken', () => {
    const data = {
      userId: 'id',
      email: 'email',
    };

    it('returns data', () => {
      const decodeSpy = jest.spyOn(jwtService, 'decode').mockReturnValue(data);

      const result = service['decodeToken']('token');
      expect(decodeTokenSpy).toBeCalledWith('token');
      expect(decodeSpy).toBeCalledWith('token');
      expect(result).toEqual(data);
    });
  });

  describe('generateTokens', () => {
    it('returns tokens', async () => {
      const signAsyncSpy = jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      const result = await service['generateTokens']('email', 'id');
      expect(generateTokensSpy).toBeCalledWith('email', 'id');
      expect(signAsyncSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ accessToken: 'token', refreshToken: 'token' });
    });
  });

  describe('saveRefreshToken', () => {
    const token = new TokenEntity();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('updates refresh token in db', async () => {
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(token);
      const saveSpy = jest.spyOn(repository, 'save');
      const createSpy = jest.spyOn(repository, 'create');
      await service['saveRefreshToken']('id', 'token');

      expect(saveRefreshTokenSpy).toBeCalledWith('id', 'token');
      expect(findOneBySpy).toBeCalledWith({ userId: 'id' });
      expect(saveSpy).toBeCalled();
      expect(createSpy).not.toBeCalled();
    });

    it('creates refresh token and saves it in db', async () => {
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const saveSpy = jest.spyOn(repository, 'save');
      const createSpy = jest.spyOn(repository, 'create');
      await service['saveRefreshToken']('id', 'token');

      expect(saveRefreshTokenSpy).toBeCalledWith('id', 'token');
      expect(findOneBySpy).toBeCalledWith({ userId: 'id' });
      expect(createSpy).toBeCalled();
      expect(saveSpy).toBeCalled();
    });
  });

  describe('getTokens', () => {
    const user = new UserEntity();
    user.email = 'email';
    user.id = 'id';

    it('returns tokens', async () => {
      const getTokensSpy = jest.spyOn(service, 'getTokens');
      generateTokensSpy.mockResolvedValue(tokens);
      const result = await service.getTokens(user);

      expect(getTokensSpy).toBeCalledWith(user);
      expect(generateTokensSpy).toBeCalledWith(user.email, user.id);
      expect(saveRefreshTokenSpy).toBeCalledWith(user.id, tokens.refreshToken);
      expect(result).toEqual(tokens);
    });
  });

  describe('removeToken', () => {
    const token = new TokenEntity();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('removes token', async () => {
      const removeTokenSpy = jest.spyOn(service, 'removeToken');
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(token);
      const deleteSpy = jest.spyOn(repository, 'delete');
      await service.removeToken('id');

      expect(removeTokenSpy).toBeCalledWith('id');
      expect(findOneBySpy).toBeCalledWith({ userId: 'id' });
      expect(deleteSpy).toBeCalledWith(token);
    });

    it('exits when token is not found', async () => {
      const removeTokenSpy = jest.spyOn(service, 'removeToken');
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const deleteSpy = jest.spyOn(repository, 'delete');
      await service.removeToken('id');

      expect(removeTokenSpy).toBeCalledWith('id');
      expect(findOneBySpy).toBeCalledWith({ userId: 'id' });
      expect(deleteSpy).not.toBeCalled();
    });
  });

  describe('refreshToken', () => {
    const data = {
      email: 'email',
      userId: 'id',
    };

    it('calls decodeToken', async () => {
      decodeTokenSpy.mockReturnValue(data);
      await service.refreshTokens('token');
      expect(decodeTokenSpy).toBeCalled();
    });

    it('throws ForbiddenException when refresh token is not valid', async () => {
      decodeTokenSpy.mockReturnValue(null);
      try {
        await service.refreshTokens('token');
        expect(decodeTokenSpy).toBeCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('return tokens', async () => {
      const refreshTokensSpy = jest.spyOn(service, 'refreshTokens');
      decodeTokenSpy.mockReturnValue(data);
      generateTokensSpy.mockResolvedValue(tokens);
      const result = await service.refreshTokens('token');

      expect(refreshTokensSpy).toBeCalledWith('token');
      expect(decodeTokenSpy).toBeCalledWith('token');
      expect(generateTokensSpy).toBeCalledWith(data.email, data.userId);
      expect(saveRefreshTokenSpy).toBeCalledWith(data.userId, tokens.refreshToken);
      expect(result).toEqual(tokens);
    });
  });
});
