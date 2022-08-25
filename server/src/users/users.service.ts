import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ProfilesService } from '../profiles/profiles.service';
import { TokensService } from '../tokens/tokens.service';
import { InvalidActivationLinkException, UserAlreadyExistException } from '../core/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private config: ConfigService,
    private tokensService: TokensService,
    private profileService: ProfilesService,
    private mailService: MailService,
  ) {}

  private async create({ email, password }: CreateUserDto) {
    const candidate = await this.findOneByEmail(email);

    if (candidate) {
      throw new UserAlreadyExistException(email);
    }

    const hashedPassword = await this.hashPassword(password);

    const createdUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
  }

  async register({ userName, ...rest }: RegisterUserDto) {
    const user = await this.create(rest);
    const tokens = await this.tokensService.getTokens(user);
    const profile = await this.profileService.create({
      userName,
      userId: user.id,
      type: 'user',
    });

    await this.mailService.sendActivationMail(userName, user.email, user.activationLink);

    return { user, profile, ...tokens };
  }

  async login(user: UserEntity) {
    const tokens = await this.tokensService.getTokens(user);
    const profile = await this.profileService.findOneByUserId(user.id);

    return { user, profile, ...tokens };
  }

  async logout(userId: string) {
    await this.tokensService.removeToken(userId);
  }

  async refresh(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const data = await this.login(user);

    return data;
  }

  async hashPassword(password: string) {
    const hashRounds = +this.config.get('HASH_ROUNDS') || 10;
    const hashedPassword = await hash(password, hashRounds);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string) {
    const isEqual = await compare(password, hashedPassword);
    return isEqual;
  }

  async activate(link: string) {
    const user = await this.userRepository.findOneBy({ activationLink: link });

    if (!user) {
      throw new InvalidActivationLinkException();
    }

    user.isActivated = true;
    await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await this.comparePasswords(password, user.password);

    return isValid ? user : null;
  }
}
