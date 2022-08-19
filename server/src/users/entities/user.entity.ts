import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isActivated: boolean;

  @Generated('uuid')
  @Column()
  activationLink: string;

  @Exclude()
  @Column()
  password: string;

  @VersionColumn()
  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  @CreateDateColumn()
  createdAt: number;

  @Transform(({ value }) => new Date(value).getTime())
  @UpdateDateColumn()
  updatedAt: number;
}
