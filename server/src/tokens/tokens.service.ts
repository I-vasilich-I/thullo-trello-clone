import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { TokenEntity } from './entities/token.entity';

type Payload = {
  userId: string;
  email: string;
  exp?: number;
};

@Injectable()
export class TokensService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async getTokens(user: UserEntity) {
    const { email, id } = user;
    const { accessToken, refreshToken } = await this.generateTokens(email, id);

    await this.saveRefreshToken(id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private decodeToken(token: string) {
    const data = this.jwtService.decode(token) as Payload;
    return data;
  }

  async removeToken(userId: string) {
    const token = await this.tokenRepository.findOneBy({ userId });

    if (!token) {
      return;
    }

    await this.tokenRepository.delete(token);
  }

  async refreshTokens(refreshToken: string) {
    const data = this.decodeToken(refreshToken);

    if (!data) {
      throw new ForbiddenException('Refresh token malformed');
    }

    const { email, userId } = data;
    const tokens = await this.generateTokens(email, userId);
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(email: string, id: string) {
    const payload = { email, userId: id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.config.get<string>('TOKEN_EXPIRE_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.config.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const findToken = await this.tokenRepository.findOneBy({ userId });
    const HASH_ROUNDS = +this.config.get('HASH_ROUNDS') || 10;
    const hashedRefreshToken = await hash(refreshToken, HASH_ROUNDS);

    if (findToken) {
      findToken.refreshToken = hashedRefreshToken;
      await this.tokenRepository.save(findToken);
      return;
    }

    const createToken = this.tokenRepository.create({
      refreshToken: hashedRefreshToken,
      userId,
    });

    await this.tokenRepository.save(createToken);
    return;
  }
}
