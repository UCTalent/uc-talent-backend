import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';

@Entity('job_closure_reasons')
export class JobClosureReason extends BaseEntity {
  @Column()
  jobId: string;

  @Column({ nullable: true })
  otherReason: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.jobClosureReasons)
  @JoinColumn({ name: 'jobId' })
  job: Job;
} 