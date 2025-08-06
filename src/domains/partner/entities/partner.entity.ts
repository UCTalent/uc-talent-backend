import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { PartnerHost } from './partner-host.entity';

@Entity('partners')
export class Partner extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => PartnerHost, (host) => host.partner)
  hosts: PartnerHost[];
} 