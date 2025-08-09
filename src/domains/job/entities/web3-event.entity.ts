import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Job } from './job.entity';

@Entity('web3_events')
export class Web3Event extends BaseEntity {
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ name: 'event_data', type: 'jsonb' })
  eventData: Record<string, any>;

  @Column({ name: 'transaction_hash', nullable: true })
  transactionHash: string;

  @Column({ name: 'block_number', nullable: true })
  blockNumber: number;

  @Column({ name: 'chain_id', nullable: true })
  chainId: string;

  // Relationships
  @ManyToOne(() => Job, job => job.web3Events)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
