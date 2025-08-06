import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { SocialAccount } from './social-account.entity';

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial'
}

@Entity('social_sync_logs')
export class SocialSyncLog extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SyncStatus
  })
  @Index()
  status: SyncStatus;

  @Column({ name: 'sync_type' })
  syncType: string; // manual, auto, scheduled

  @Column({ name: 'changes_count', default: 0 })
  changesCount: number;

  @Column({ type: 'jsonb', nullable: true })
  changes: any[];

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'sync_duration_ms', nullable: true })
  syncDurationMs: number;

  // Foreign Keys
  @Column({ name: 'social_account_id' })
  socialAccountId: string;

  // Relationships
  @ManyToOne(() => SocialAccount, socialAccount => socialAccount.syncLogs)
  @JoinColumn({ name: 'social_account_id' })
  socialAccount: SocialAccount;
}