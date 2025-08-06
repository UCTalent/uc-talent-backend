import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from '@job/entities/job.entity';
import { Talent } from '@talent/entities/talent.entity';

@Entity('specialities')
export class Speciality extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
} 