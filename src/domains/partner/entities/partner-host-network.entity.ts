import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { PartnerHost } from './partner-host.entity';

@Entity('partner_host_networks')
export class PartnerHostNetwork extends BaseEntity {
  @Column()
  partnerHostId: string;

  @Column()
  network: string;

  @Column({ nullable: true })
  source: string;

  // Relationships
  @ManyToOne(() => PartnerHost, (host) => host.networks)
  @JoinColumn({ name: 'partnerHostId' })
  partnerHost: PartnerHost;
} 