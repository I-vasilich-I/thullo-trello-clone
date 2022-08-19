import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private config: ConfigService,
  ) {}

  async create({ email, password }: CreateUserDto) {
    const hashedPassword = await this.hashPassword(password);

    const createdUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
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
}
