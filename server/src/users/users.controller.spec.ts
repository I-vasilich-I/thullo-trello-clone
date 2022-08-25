import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { response } from 'express';
import { UserEntity } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let spyUserService: UsersService;
  let spyCookie: any;
  let spyClearCookie: any;

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UsersService,
      useFactory: () => ({
        register: jest.fn(() => ({})),
        activate: jest.fn(() => ({})),
        login: jest.fn(() => ({})),
        logout: jest.fn(() => ({})),
        refresh: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserServiceProvider, ConfigService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    spyUserService = module.get<UsersService>(UsersService);
    response.cookie = jest.fn();
    spyCookie = jest.spyOn(response, 'cookie');
    spyClearCookie = jest.spyOn(response, 'clearCookie');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling register method', async () => {
    const registerDto = new RegisterUserDto();
    const result = await controller.register(registerDto, response);

    expect(spyUserService.register).toHaveBeenCalled();
    expect(spyCookie).toHaveBeenCalledTimes(1);
    expect(result).not.toEqual(null);
  });

  it('calling activate method', async () => {
    await controller.activate('link');
    expect(spyUserService.activate).toHaveBeenCalled();
    expect(spyUserService.activate).toBeCalledWith('link');
  });

  it('calling login method', async () => {
    const request = {
      user: new UserEntity(),
    };
    const result = await controller.login(request, response);
    expect(spyUserService.login).toHaveBeenCalled();
    expect(spyUserService.login).toBeCalledWith(request.user);
    expect(spyCookie).toHaveBeenCalledTimes(2);
    expect(result).not.toEqual(null);
  });

  it('calling logout method', async () => {
    const request = {
      user: {
        userId: 'id',
      },
    };
    await controller.logout(request, response);
    expect(spyUserService.logout).toHaveBeenCalled();
    expect(spyUserService.logout).toBeCalledWith('id');
    expect(spyClearCookie).toHaveBeenCalledTimes(2);
  });

  it('calling refresh method', async () => {
    const request = {
      user: {
        userId: 'id',
      },
    };
    const result = await controller.refresh(request, response);
    expect(spyUserService.refresh).toHaveBeenCalled();
    expect(spyUserService.refresh).toBeCalledWith('id');
    expect(spyCookie).toHaveBeenCalledTimes(1);
    expect(result).not.toEqual(null);
  });
});
