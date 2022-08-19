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
  UseInterceptors,
} from '@nestjs/common';
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
  async activate(@Param('link', new ParseUUIDPipe({ version: '4' })) link: string) {
    await this.usersService.activate(link);
  }
}
