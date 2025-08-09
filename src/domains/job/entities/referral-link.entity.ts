import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';
import { User } from '@user/entities/user.entity';

@Entity('referral_links')
export class ReferralLink extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'referrer_id' })
  referrerId: string;

  // Relationships
  @ManyToOne(() => Job, job => job.referralLinks)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;
}
