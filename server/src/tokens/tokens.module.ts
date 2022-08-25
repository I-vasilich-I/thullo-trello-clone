import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './tokens.service';
import { TokenEntity } from './entities/token.entity';
import { JwtAccessStrategy } from '../core/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '../core/strategies/jwt-refresh.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), PassportModule, JwtModule.register({})],
  providers: [TokensService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [TypeOrmModule],
})
export class TokensModule {}
