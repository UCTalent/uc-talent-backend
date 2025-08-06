import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from './talent.entity';

@Entity('external_links')
export class ExternalLink extends BaseEntity {
  @Column()
  talentId: string;

  @Column()
  title: string;

  @Column()
  url: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.externalLinks)
  @JoinColumn({ name: 'talentId' })
  talent: Talent;
} 