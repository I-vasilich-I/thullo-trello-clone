import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryFake } from '../../test/utils/repository';
import { Repository } from 'typeorm';
import { InvalidActivationLinkException } from '../core/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    const RepositoryProvider = {
      provide: getRepositoryToken(UserEntity),
      useClass: RepositoryFake,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, RepositoryProvider, ConfigService],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Creating user', () => {
    const hashedPassword = 'hashedPassword';

    const dto: CreateUserDto = {
      email: 'user@gmail.com',
      password: 'password',
    };

    const newUser = {
      ...dto,
      password: hashedPassword,
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

    let repositoryCreateSpy: any;
    let repositorySaveSpy: any;
    let hashSpy: any;

    beforeAll(() => {
      repositoryCreateSpy = jest.spyOn(repository, 'create').mockReturnValue(createdUser);
      repositorySaveSpy = jest.spyOn(repository, 'save').mockResolvedValue(savedUser);
      hashSpy = jest.spyOn(service, 'hashPassword').mockResolvedValue(hashedPassword);
    });

    it('calls create method with correct parameters', () => {
      const createSpy = jest.spyOn(service, 'create');

      service.create(dto);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });

    it('calls repository with correct parameters', async () => {
      await service.create(dto);

      expect(repositoryCreateSpy).toBeCalledWith(newUser);
      expect(repositorySaveSpy).toBeCalledWith(createdUser);
    });

    it('calls hashPassword with correct parameters', async () => {
      await service.create(dto);
      expect(hashSpy).toBeCalledWith(dto.password);
    });

    it('creates user with correct parameters', async () => {
      const result = await service.create(dto);
      expect(result).toEqual(savedUser);
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
});