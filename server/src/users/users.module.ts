import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profiles/entities/profile.entity';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), forwardRef(() => ConfigModule)],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, ProfilesService],
})
export class UsersModule {}
