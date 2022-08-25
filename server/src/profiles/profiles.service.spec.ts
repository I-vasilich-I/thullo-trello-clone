import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositoryFake } from '../../test/utils/repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let repository: Repository<ProfileEntity>;

  const dto: CreateProfileDto = {
    userId: '1111',
    userName: 'User',
    type: 'user',
  };

  const createdProfile = new ProfileEntity();

  const savedProfile: ProfileEntity = {
    ...dto,
    id: '2',
    phone: null,
    photo: null,
    bio: null,
    version: 1,
    createdAt: 1,
    updatedAt: 1,
  };

  beforeAll(async () => {
    const RepositoryProvider = {
      provide: getRepositoryToken(ProfileEntity),
      useClass: RepositoryFake,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService, RepositoryProvider],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    repository = module.get(getRepositoryToken(ProfileEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Creating profile', () => {
    let repositoryCreateSpy: any;
    let repositorySaveSpy: any;

    beforeAll(() => {
      repositoryCreateSpy = jest.spyOn(repository, 'create').mockReturnValue(createdProfile);
      repositorySaveSpy = jest.spyOn(repository, 'save').mockResolvedValue(savedProfile);
    });

    it('calls create method with correct parameters', () => {
      const createSpy = jest.spyOn(service, 'create');
      service.create(dto);
      expect(createSpy).toHaveBeenCalledWith(dto);
    });

    it('calls repository with correct parameters', async () => {
      await service.create(dto);

      expect(repositoryCreateSpy).toHaveBeenCalledWith(dto);
      expect(repositorySaveSpy).toHaveBeenCalledWith(createdProfile);
    });

    it('creates profile with correct parameters without optional props', async () => {
      const result = await service.create(dto);
      expect(result).toEqual(savedProfile);
    });

    it('creates profile with correct parameters with optional props', async () => {
      const fullDto: CreateProfileDto = { ...dto, phone: '1', photo: '2', bio: '3' };
      const fullSavedProfile: ProfileEntity = { ...savedProfile, phone: '1', photo: '2', bio: '3' };
      jest.spyOn(repository, 'save').mockResolvedValue(fullSavedProfile);

      const result = await service.create(fullDto);
      expect(result).toEqual(fullSavedProfile);
    });
  });

  describe('Find one by id', () => {
    const profile = new ProfileEntity();
    profile.id = '1';

    it('calls foundOneById with correct parameters', async () => {
      const repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(profile);
      const findOneById = jest.spyOn(service, 'findOneById');
      const result = await service.findOneById('1');
      expect(findOneById).toBeCalledWith('1');
      expect(repositoryFindOneBy).toBeCalledWith({ id: '1' });
      expect(result).toEqual(profile);
    });
  });

  describe('Find one by user id', () => {
    const profile = new ProfileEntity();
    profile.userId = '1';

    it('calls foundOneByUserId with correct parameters', async () => {
      const repositoryFindOneBy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(profile);
      const findOneByUserId = jest.spyOn(service, 'findOneByUserId');
      const result = await service.findOneByUserId('1');
      expect(findOneByUserId).toBeCalledWith('1');
      expect(repositoryFindOneBy).toBeCalledWith({ userId: '1' });
      expect(result).toEqual(profile);
    });
  });
});
