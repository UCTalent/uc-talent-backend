import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

import { Job } from './job.entity';

export enum JobReferralStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Entity('job_referrals')
export class JobReferral extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'referrer_id' })
  referrerId: string;

  @Column()
  candidateEmail: string;

  @Column()
  candidateName: string;

  @Column({ nullable: true })
  candidatePhonenumber: string;

  @Column({ type: 'text', nullable: true })
  candidateIntroduction: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({
    type: 'enum',
    enum: JobReferralStatus,
    default: JobReferralStatus.PENDING,
  })
  status: JobReferralStatus;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  personalSign: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.jobReferrals)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;
}
