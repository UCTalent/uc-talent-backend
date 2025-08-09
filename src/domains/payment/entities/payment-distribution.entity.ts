import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Job } from '@job/entities/job.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  COMPLETED = 'completed',
}

@Entity('payment_distributions')
export class PaymentDistribution extends BaseEntity {
  @Column({ name: 'amount_cents', type: 'bigint', default: 0 })
  amountCents: number;

  @Column({ name: 'amount_currency', default: 'USDT' })
  amountCurrency: string;

  @Column({ name: 'claimed_at', nullable: true })
  claimedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'payment_type' })
  paymentType: string; // referral_success, apply_success, close_no_hiring

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ name: 'recipient_type', nullable: true })
  recipientType: string;

  @Column({ name: 'recipient_id', nullable: true })
  recipientId: string;

  @Column()
  role: string; // candidate, referrer, hiring_manager, platform_fee

  @Column({ default: 'pending' })
  status: string; // pending, failed, completed

  @Column({ name: 'transaction_hash', nullable: true })
  transactionHash: string;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.paymentDistributions)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, (user) => user.paymentDistributions, {
    nullable: true,
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
