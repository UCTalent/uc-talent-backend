import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Talent } from '@talent/entities/talent.entity';

@Entity('external_links')
export class ExternalLink extends BaseEntity {
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column()
  title: string;

  @Column()
  url: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.externalLinks)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
