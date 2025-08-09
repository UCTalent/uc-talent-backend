import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@shared/infrastructure/database/base.entity';

import { Organization } from './organization.entity';

@Entity('industries')
export class Industry extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => Organization, (organization) => organization.industry)
  organizations: Organization[];
}
