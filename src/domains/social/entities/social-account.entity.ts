import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@domains/user/entities/user.entity';

export enum SocialProvider {
  FACEBOOK = 'facebook',
  X = 'x',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  DISCORD = 'discord',
  TELEGRAM = 'telegram'
}

export enum SocialAccountStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  DISCONNECTED = 'disconnected'
}

@Entity('social_accounts')
export class SocialAccount extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SocialProvider
  })
  @Index()
  provider: SocialProvider;

  @Column()
  @Index()
  uid: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ name: 'last_synced_at', nullable: true })
  lastSyncedAt: Date;

  @Column({
    type: 'enum',
    enum: SocialAccountStatus,
    default: SocialAccountStatus.ACTIVE
  })
  status: SocialAccountStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relationships
  @ManyToOne(() => User, user => user.socialAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SocialSyncLog, syncLog => syncLog.socialAccount)
  syncLogs: SocialSyncLog[];
}

// Import at the end to avoid circular dependency
import { SocialSyncLog } from './social-sync-log.entity'; 