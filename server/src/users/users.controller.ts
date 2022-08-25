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
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from '../core/decorators';
import { LocalAuthGuard } from '../core/guards/local.guard';
import { DEFAULT_CLIENT_URL } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';
import { JwtRefreshAuthGuard } from '../core/guards/jwt-refresh.guard';

// max age of refresh token - 30 days
const maxAge = 30 * 24 * 60 * 60 * 1000;

@Controller()
export class UsersController {
  constructor(private usersService: UsersService, private config: ConfigService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto, @Res({ passthrough: true }) response: Response) {
    const data = await this.usersService.register(dto);
    response.cookie('refreshToken', data.refreshToken, { maxAge, httpOnly: true });

    return data;
  }

  @Public()
  @Get('activate/:link')
  @HttpCode(HttpStatus.OK)
  @Redirect(DEFAULT_CLIENT_URL)
  async activate(@Param('link', ParseUUIDPipe) link: string) {
    await this.usersService.activate(link);
    const url = `${this.config.get('CLIENT_URL')}` || DEFAULT_CLIENT_URL;

    return { url };
  }

  @ApiBody({
    type: CreateUserDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const data = await this.usersService.login(req.user);
    response.cookie('refreshToken', data.refreshToken, { maxAge, httpOnly: true });
    response.cookie('loggedIn', true, { httpOnly: true });

    return data;
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Res({ passthrough: true }) response: Response) {
    await this.usersService.logout(req.user.userId);
    response.clearCookie('refreshToken');
    response.clearCookie('loggedIn');
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req, @Res({ passthrough: true }) response: Response) {
    const data = await this.usersService.refresh(req.user.userId);
    response.cookie('refreshToken', data.refreshToken, { maxAge, httpOnly: true });

    return data;
  }
}
