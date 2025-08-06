import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from '@job/entities/job.entity';

@Entity('web3_events')
export class Web3Event extends BaseEntity {
  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ type: 'jsonb' })
  data: any;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Job, job => job.web3Events)
  @JoinColumn({ name: 'job_id' })
  job: Job;
} 