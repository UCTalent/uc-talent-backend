import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Partner } from './partner.entity';
import { PartnerHostNetwork } from './partner-host-network.entity';
import { Job } from '@job/entities/job.entity';

@Entity('partner_hosts')
export class PartnerHost extends BaseEntity {
  @Column()
  partnerId: string;

  @Column()
  host: string;

  @Column({ default: false })
  isUcTalent: boolean;

  // Relationships
  @ManyToOne(() => Partner, (partner) => partner.hosts)
  @JoinColumn({ name: 'partnerId' })
  partner: Partner;

  @OneToMany(() => PartnerHostNetwork, (network) => network.partnerHost)
  networks: PartnerHostNetwork[];

  @OneToMany(() => Job, (job) => job.partnerHost)
  jobs: Job[];
} 