import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/types';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  type: Users;

  @Optional()
  @IsString()
  photo?: string;

  @Optional()
  @IsString()
  bio?: string;

  @Optional()
  @IsString()
  phone?: string;
}
