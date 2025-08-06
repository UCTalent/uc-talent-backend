import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { City } from './city.entity';
import { Organization } from '@organization/entities/organization.entity';
import { Job } from '@job/entities/job.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  // Relationships
  @OneToMany(() => City, (city) => city.country)
  cities: City[];

  @OneToMany(() => Organization, (organization) => organization.country)
  organizations: Organization[];

  @OneToMany(() => Job, (job) => job.country)
  jobs: Job[];
} 