import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { PartnerHost } from './partner-host.entity';

export enum NetworkType {
  COTI_V2 = 'coti_v2',
  BASE = 'base',
  BNB = 'bnb',
  ETHEREUM = 'ethereum',
}

@Entity('partner_host_networks')
export class PartnerHostNetwork extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NetworkType,
  })
  @Index()
  network: NetworkType;

  @Column({ default: false })
  default: boolean;

  // Foreign Keys
  @Column({ name: 'partner_host_id' })
  partnerHostId: string;

  // Relationships
  @ManyToOne(() => PartnerHost, (partnerHost) => partnerHost.networks)
  @JoinColumn({ name: 'partner_host_id' })
  partnerHost: PartnerHost;
}
