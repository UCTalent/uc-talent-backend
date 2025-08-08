import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { User } from '@domains/user/entities/user.entity';

@Entity('social_settings')
export class SocialSetting extends BaseEntity {
  @Column({ name: 'show_linkedin_profile', default: true })
  showLinkedInProfile: boolean;

  @Column({ name: 'show_github_repos', default: true })
  showGitHubRepos: boolean;

  @Column({ name: 'show_social_connections', default: false })
  showSocialConnections: boolean;

  @Column({ name: 'allow_profile_sync', default: true })
  allowProfileSync: boolean;

  @Column({ name: 'public_social_links', type: 'jsonb', default: '[]' })
  publicSocialLinks: string[];

  @Column({ name: 'auto_sync', default: true })
  autoSync: boolean;

  @Column({ name: 'sync_frequency', default: 'daily' })
  syncFrequency: string; // daily, weekly, monthly

  @Column({
    name: 'sync_fields',
    type: 'jsonb',
    default: '["profile", "connections"]',
  })
  syncFields: string[];

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relationships
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
