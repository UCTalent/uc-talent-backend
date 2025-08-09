import { Column, Entity, OneToMany } from 'typeorm';

import { Job } from '@job/entities/job.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from '@talent/entities/talent.entity';

@Entity('specialities')
export class Speciality extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
