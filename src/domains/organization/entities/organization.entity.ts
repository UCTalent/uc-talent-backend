import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { City } from '@location/entities/city.entity';
import { Country } from '@location/entities/country.entity';
import { Industry } from './industry.entity';
import { Job } from '@job/entities/job.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  cityId: string;

  @Column({ nullable: true })
  countryId: string;

  @Column({ nullable: true })
  industryId: string;

  // Relationships
  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @ManyToOne(() => Industry, { nullable: true })
  @JoinColumn({ name: 'industryId' })
  industry: Industry;

  @OneToMany(() => Job, (job) => job.organization)
  jobs: Job[];
} 