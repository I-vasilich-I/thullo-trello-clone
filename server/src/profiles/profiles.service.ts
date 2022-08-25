import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async create(dto: CreateProfileDto) {
    const createdProfile = this.profileRepository.create(dto);
    const savedProfile = await this.profileRepository.save(createdProfile);
    return savedProfile;
  }

  async findOneById(id: string) {
    const profile = await this.profileRepository.findOneBy({ id });
    return profile;
  }

  async findOneByUserId(userId: string) {
    const profile = await this.profileRepository.findOneBy({ userId });
    return profile;
  }
}
