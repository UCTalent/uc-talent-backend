import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { City } from '@location/entities/city.entity';
import { Country } from '@location/entities/country.entity';
import { Industry } from './industry.entity';
import { Job } from '@job/entities/job.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  @Column({ name: 'found_date', type: 'date', nullable: true })
  foundDate: Date;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  website: string;

  @Column({ name: 'org_type', nullable: true })
  orgType: string; // company, agency, startup, nonprofit

  @Column({ nullable: true })
  size: string; // startup, small, medium, large

  @Column({ default: 'active' })
  status: string; // active, inactive, suspended

  // Logo file information
  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'logo_filename', nullable: true })
  logoFilename: string;

  @Column({ name: 'logo_size', nullable: true })
  logoSize: number;

  @Column({ name: 'logo_content_type', nullable: true })
  logoContentType: string;

  // Foreign Keys
  @Column({ name: 'city_id', nullable: true })
  cityId: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @Column({ name: 'industry_id', nullable: true })
  industryId: string;

  // Relationships
  @ManyToOne(() => City, city => city.organizations, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Country, country => country.organizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Industry, industry => industry.organizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @OneToMany(() => Job, job => job.organization)
  jobs: Job[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;

  @Column({ select: false, insert: false, update: false })
  activeJobsCount?: number;
}
