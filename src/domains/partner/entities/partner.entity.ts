import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { PartnerHost } from './partner-host.entity';

@Entity('partners')
export class Partner extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ name: 'is_uc_talent', default: false })
  isUcTalent: boolean;

  // Relationships
  @OneToMany(() => PartnerHost, partnerHost => partnerHost.partner)
  partnerHosts: PartnerHost[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  hostsCount?: number;

  @Column({ select: false, insert: false, update: false })
  networksCount?: number;

  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;
} 