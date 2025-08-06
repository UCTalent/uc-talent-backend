import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';
import { User } from '@user/entities/user.entity';

@Entity('referral_links')
export class ReferralLink extends BaseEntity {
  @Column()
  jobId: string;

  @Column()
  referrerId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.referralLinks)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'referrerId' })
  referrer: User;
} 