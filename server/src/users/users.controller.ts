import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Redirect,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_CLIENT_URL } from '../constants';
import { MailService } from '../mail/mail.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfilesService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() { userName, ...rest }: RegisterUserDto) {
    const user = await this.usersService.create(rest);
    const profile = await this.profileService.create({
      userName,
      userId: user.id,
      type: 'user',
    });

    await this.mailService.sendActivationMail(userName, user.email, user.activationLink);

    return {
      user,
      profile,
    };
  }

  @Get('activate/:link')
  @HttpCode(HttpStatus.OK)
  @Redirect(DEFAULT_CLIENT_URL)
  async activate(@Param('link', ParseUUIDPipe) link: string) {
    await this.usersService.activate(link);

    const url = `${this.config.get('CLIENT_URL')}` || DEFAULT_CLIENT_URL;

    return { url };
  }
}
