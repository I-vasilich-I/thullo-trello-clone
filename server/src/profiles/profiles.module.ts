import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  providers: [ProfilesService],
  exports: [TypeOrmModule],
})
export class ProfilesModule {}
