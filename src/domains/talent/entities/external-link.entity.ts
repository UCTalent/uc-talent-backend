import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('external_links')
export class ExternalLink extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'url' })
  url: string;

  // Relationships
  @ManyToOne(() => Talent, talent => talent.externalLinks)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
