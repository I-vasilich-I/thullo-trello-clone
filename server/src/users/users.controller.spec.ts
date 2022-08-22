import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../mail/mail.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let spyUserService: UsersService;
  let spyProfileService: ProfilesService;
  let spyMailService: MailService;

  beforeAll(async () => {
    const UserServiceProvider = {
      provide: UsersService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        activate: jest.fn(() => ({})),
      }),
    };

    const ProfilesServiceProvider = {
      provide: ProfilesService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
      }),
    };

    const MailServiceProvider = {
      provide: MailService,
      useFactory: () => ({
        sendActivationMail: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserServiceProvider, ProfilesServiceProvider, MailServiceProvider, ConfigService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    spyUserService = module.get<UsersService>(UsersService);
    spyProfileService = module.get<ProfilesService>(ProfilesService);
    spyMailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling register method', async () => {
    const registerDto = new RegisterUserDto();
    const result = await controller.register(registerDto);

    expect(spyUserService.create).toHaveBeenCalled();
    expect(spyProfileService.create).toHaveBeenCalled();
    expect(spyMailService.sendActivationMail).toHaveBeenCalled();
    expect(result).not.toEqual(null);
  });

  it('calling activate method', async () => {
    await controller.activate('link');
    expect(spyUserService.activate).toHaveBeenCalled();
  });
});
