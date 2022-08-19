import { Transform } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  userId: string;

  @Column()
  userName: string;

  @Column()
  type: string;

  @Column({ nullable: true, default: null })
  photo: string;

  @Column({ nullable: true, default: null })
  bio: string;

  @Column({ nullable: true, default: null })
  phone: string;

  @VersionColumn()
  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  @CreateDateColumn()
  createdAt: number;

  @Transform(({ value }) => new Date(value).getTime())
  @UpdateDateColumn()
  updatedAt: number;
}
