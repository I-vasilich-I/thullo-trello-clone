import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';
import { LocalStrategy } from '../core/strategies/local.strategy';
import { ProfilesModule } from '../profiles/profiles.module';
import { ProfilesService } from '../profiles/profiles.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ProfilesModule, forwardRef(() => TokensModule), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, ProfilesService, TokensService, LocalStrategy],
  exports: [TypeOrmModule],
})
export class UsersModule {}
