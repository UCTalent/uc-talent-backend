import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Job } from '@domains/job/entities/job.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { Partner } from './partner.entity';
import { PartnerHostNetwork } from './partner-host-network.entity';

@Entity('partner_hosts')
export class PartnerHost extends BaseEntity {
  @Column({ unique: true })
  @Index()
  host: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ name: 'access_token', unique: true })
  @Index()
  accessToken: string;

  @Column({ name: 'is_uc_talent', default: false })
  isUcTalent: boolean;

  // Foreign Keys
  @Column({ name: 'partner_id' })
  partnerId: string;

  // Relationships
  @ManyToOne(() => Partner, (partner) => partner.partnerHosts)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @OneToMany(() => PartnerHostNetwork, (network) => network.partnerHost)
  networks: PartnerHostNetwork[];

  @OneToMany(() => Job, (job) => job.partnerHost)
  jobs: Job[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;

  @Column({ select: false, insert: false, update: false })
  networksCount?: number;
}
