import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@user/entities/user.entity';
import { Job } from '@job/entities/job.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  CLAIMED = 'claimed',
  PAID = 'paid',
}

@Entity('payment_distributions')
export class PaymentDistribution extends BaseEntity {
  @Column()
  recipientType: string;

  @Column()
  recipientId: string;

  @Column({ nullable: true })
  jobId: string;

  @Column({ type: 'bigint', default: 0 })
  amountCents: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  claimedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  // Relationships
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @ManyToOne(() => Job, { nullable: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;
} 