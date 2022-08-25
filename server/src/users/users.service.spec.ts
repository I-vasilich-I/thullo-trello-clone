import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryFake } from '../../test/utils/repository';
import { Repository } from 'typeorm';
import { InvalidActivationLinkException, UserAlreadyExistException } from '../core/exceptions';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokensService } from '../tokens/tokens.service';
import { ProfilesService } from '../profiles/profiles.service';
import { MailService } from '../mail/mail.service';
import { ProfileEntity } from '../profiles/entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;
  let tokensService: TokensService;
  let profileService: ProfilesService;
  let mailService: MailService;

  beforeAll(async () => {
    const RepositoryProvider = {
      provide: getRepositoryToken(UserEntity),
      useClass: RepositoryFake,
    };

    const TokenServiceProvider = {
      provide: TokensService,
      useFactory: () => ({
        getTokens: jest.fn(),
        removeToken: jest.fn(),
      }),
    };

    const ProfileServiceProvider = {
      provide: ProfilesService,
      useFactory: () => ({
        create: jest.fn(),
        findOneByUserId: jest.fn(),
      }),
    };

    const MailServiceProvider = {
      provide: MailService,
      useFactory: () => ({
        sendActivationMail: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        RepositoryProvider,
        TokenServiceProvider,
        ProfileServiceProvider,
        MailServiceProvider,
        ConfigService,
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
    tokensService = module.get(TokensService);
    profileService = module.get(ProfilesService);
    mailService = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register user', () => {
    const hashedPassword = 'hashedPassword';

    const dto: RegisterUserDto = {
      userName: 'Oleg',
      email: 'user@gmail.com',
      password: 'password',
    };

    const createdUser = new UserEntity();
    createdUser.password = hashedPassword;

    const savedUser: UserEntity = {
      id: 'id',
      email: dto.email,
      password: hashedPassword,
      isActivated: false,
      activationLink: '1',
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const profile: ProfileEntity = {
      id: '2',
      phone: null,
      photo: null,
      bio: null,
      version: 1,
      createdAt: 1,
      updatedAt: 1,
      userId: 'id',
      userName: 'Oleg',
      type: 'user',
    };

    const tokens = {
      accessToken: 'at',
      refreshToken: 'rt',
    };

    const responseData = {
      user: savedUser,
      profile,
      ...tokens,
    };

    let spyGetTokens: any;
    let spyCreateProfile: any;
    let spyMail: any;

    beforeAll(() => {
      spyCreateProfile = jest.spyOn(profileService, 'create').mockResolvedValue(profile);
      spyGetTokens = jest.spyOn(tokensService, 'getTokens').mockResolvedValue(tokens);
      spyMail = jest.spyOn(mailService, 'sendActivationMail');
    });

    it('calls register method with correct parameters', async () => {
      const registerSpy = jest.spyOn(service, 'register');
      const spyCreateUser = jest.spyOn(UsersService.prototype as any, 'create').mockResolvedValue(savedUser);

      const result = await service.register(dto);
      expect(registerSpy).toBeCalledWith(dto);
      expect(spyCreateUser).toBeCalledWith({ email: dto.email, password: dto.password });
      expect(spyGetTokens).toBeCalledWith(savedUser);
      expect(spyCreateProfile).toBeCalledWith({ userName: dto.userName, userId: savedUser.id, type: 'user' });
      expect(spyMail).toHaveBeenCalled();
      expect(result).toEqual(responseData);
    });
  });

  describe('Login user', () => {
    const user = new UserEntity();
    user.id = 'id';
    const profile: ProfileEntity = {
      id: '2',
      phone: null,
      photo: null,
      bio: null,
      version: 1,
      createdAt: 1,
      updatedAt: 1,
      userId: 'id',
      userName: 'Oleg',
      type: 'user',
    };

    const tokens = {
      accessToken: 'at',
      refreshToken: 'rt',
    };

    const response = {
      user,
      profile,
      ...tokens,
    };

    it('calls login method with correct parameters', async () => {
      const spyGetTokens = jest.spyOn(tokensService, 'getTokens').mockResolvedValue(tokens);
      const spyFindOneByUserId = jest.spyOn(profileService, 'findOneByUserId').mockResolvedValue(profile);
      const spyLogin = jest.spyOn(service, 'login');
      const result = await service.login(user);
      expect(spyLogin).toBeCalledWith(user);
      expect(spyGetTokens).toHaveBeenCalled();
      expect(spyFindOneByUserId).toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });

  describe('Logout user', () => {
    it('calls logout with correct parameters', async () => {
      const spyRemoveToken = jest.spyOn(tokensService, 'removeToken');
      const spyLogout = jest.spyOn(service, 'logout');
      service.logout('id');
      expect(spyLogout).toBeCalled();
      expect(spyRemoveToken).toBeCalledWith('id');
    });
  });

  describe('Refresh tokens', () => {
    const user = new UserEntity();
    user.id = 'id';

    it('calls refresh method with correct parameters', async () => {
      const repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      const spyLogin = jest.spyOn(service, 'login');
      await service.refresh(user.id);
      expect(repositoryFindOneBy).toBeCalledWith({ id: user.id });
      expect(spyLogin).toBeCalledWith(user);
    });
  });

  describe('Activate user', () => {
    let repositoryFindOneBy: any;
    let repositorySave: any;
    const user = new UserEntity();
    user.isActivated = true;

    beforeAll(() => {
      repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      repositorySave = jest.spyOn(repository, 'save');
    });

    it('calls activate method with correct parameters', () => {
      const activateSpy = jest.spyOn(service, 'activate');
      service.activate('link');
      expect(activateSpy).toBeCalledWith('link');
    });

    it('calls repository with correct parameters', async () => {
      await service.activate('link');
      expect(repositoryFindOneBy).toBeCalledWith({ activationLink: 'link' });
    });

    it('activates user', async () => {
      await service.activate('link');
      expect(repositorySave).toBeCalledWith(user);
    });

    it('throws InvalidActivationLinkException when link is invalid', async () => {
      repositoryFindOneBy.mockResolvedValue(null);
      try {
        await service.activate('link');
        expect(repositoryFindOneBy).toBeCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidActivationLinkException);
      }
    });
  });

  describe('FindOneByEmail', () => {
    const email = 'test@email.com';
    let findOneByEmailSpy: any;
    const user = new UserEntity();
    user.email = email;

    beforeAll(() => {
      findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail');
    });

    it('calls repository with correct parameters', async () => {
      const repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      const result = await service.findOneByEmail(email);
      expect(findOneByEmailSpy).toBeCalledWith(email);
      expect(repositoryFindOneBy).toBeCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('returns null when user is not found', async () => {
      const repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const result = await service.findOneByEmail('test');
      expect(findOneByEmailSpy).toBeCalledWith('test');
      expect(repositoryFindOneBy).toBeCalledWith({ email: 'test' });
      expect(result).toBe(null);
    });
  });

  describe('ValidateUser', () => {
    const password = 'password';
    const hashedPassword = 'hashedPassword';
    const email = 'test';
    const user = new UserEntity();
    user.email = email;
    user.password = hashedPassword;
    let findOneByEmailSpy;
    let comparePasswordsSpy;
    let validateUserSpy;

    beforeEach(() => {
      findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail');
      comparePasswordsSpy = jest.spyOn(service, 'comparePasswords');
      validateUserSpy = jest.spyOn(service, 'validateUser');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns user when validateUser method is called with correct parameters', async () => {
      findOneByEmailSpy.mockResolvedValue(user);
      comparePasswordsSpy.mockResolvedValue(true);
      const result = await service.validateUser(email, password);

      expect(validateUserSpy).toBeCalledWith(email, password);
      expect(findOneByEmailSpy).toBeCalledWith(email);
      expect(comparePasswordsSpy).toBeCalledWith(password, hashedPassword);
      expect(result).toEqual(user);
    });

    it('returns null when user is not found', async () => {
      findOneByEmailSpy.mockResolvedValue(null);
      const result = await service.validateUser(email, password);

      expect(validateUserSpy).toBeCalledWith(email, password);
      expect(findOneByEmailSpy).toBeCalledWith(email);
      expect(comparePasswordsSpy).not.toBeCalled();
      expect(result).toBe(null);
    });

    it('returns null when password is not valid', async () => {
      findOneByEmailSpy.mockResolvedValue(user);
      comparePasswordsSpy.mockResolvedValue(false);
      const result = await service.validateUser(email, password);
      expect(validateUserSpy).toBeCalledWith(email, password);
      expect(findOneByEmailSpy).toBeCalledWith(email);
      expect(comparePasswordsSpy).toBeCalledWith(password, hashedPassword);
      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    let createSpy: any;
    let repositoryCreateSpy: any;
    let repositorySaveSpy: any;
    let hashPasswordSpy: any;
    const email = 'email';
    const password = 'password';
    const user = new UserEntity();
    const dto: CreateUserDto = {
      email: 'user@gmail.com',
      password: 'password',
    };

    const hashedPassword = 'hashedPassword';
    const createdUser = new UserEntity();
    createdUser.password = hashedPassword;
    const savedUser: UserEntity = {
      id: 'id',
      email: dto.email,
      password: hashedPassword,
      isActivated: false,
      activationLink: '1',
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    beforeAll(() => {
      createSpy = jest.spyOn(UsersService.prototype as any, 'create');
    });

    it('throws if user already exist', async () => {
      const findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail').mockResolvedValue(user);
      try {
        await service['create']({ email, password });
        expect(createSpy).toBeCalledWith({ email, password });
        expect(findOneByEmailSpy).toBeCalledWith(email);
      } catch (error) {
        expect(error).toBeInstanceOf(UserAlreadyExistException);
      }
    });

    it('creates user', async () => {
      repositoryCreateSpy = jest.spyOn(repository, 'create').mockReturnValue(createdUser);
      repositorySaveSpy = jest.spyOn(repository, 'save').mockResolvedValue(savedUser);
      hashPasswordSpy = jest.spyOn(service, 'hashPassword').mockResolvedValue(hashedPassword);
      const findOneByEmailSpy = jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      const result = await service['create'](dto);

      expect(createSpy).toBeCalledWith(dto);
      expect(findOneByEmailSpy).toBeCalledWith(dto.email);
      expect(hashPasswordSpy).toBeCalledWith(dto.password);
      expect(repositoryCreateSpy).toBeCalledWith({ email: dto.email, password: hashedPassword });
      expect(repositorySaveSpy).toBeCalledWith(createdUser);
      expect(result).toEqual(savedUser);
    });
  });
});
