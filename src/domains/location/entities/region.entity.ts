import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from '@job/entities/job.entity';

@Entity('regions')
export class Region extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => Job, (job) => job.region)
  jobs: Job[];
} 