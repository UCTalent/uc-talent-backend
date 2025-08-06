import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';

@Entity('web3_events')
export class Web3Event extends BaseEntity {
  @Column()
  jobId: string;

  @Column()
  eventType: string;

  @Column({ type: 'jsonb' })
  eventData: Record<string, any>;

  @Column({ nullable: true })
  transactionHash: string;

  @Column({ nullable: true })
  blockNumber: number;

  @Column({ nullable: true })
  chainId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.web3Events)
  @JoinColumn({ name: 'jobId' })
  job: Job;
} 