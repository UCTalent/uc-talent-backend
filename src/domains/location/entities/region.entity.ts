import { Column, Entity, OneToMany } from 'typeorm';

import { Job } from '@job/entities/job.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';

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
