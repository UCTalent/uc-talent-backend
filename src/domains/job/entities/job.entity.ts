import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { City } from '@location/entities/city.entity';
import { Country } from '@location/entities/country.entity';
import { Region } from '@location/entities/region.entity';
import { Organization } from '@organization/entities/organization.entity';
import { PartnerHost } from '@partner/entities/partner-host.entity';
import { PaymentDistribution } from '@payment/entities/payment-distribution.entity';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Skill } from '@skill/entities/skill.entity';
import { Speciality } from '@skill/entities/speciality.entity';

import { ChoiceOption } from './choice-option.entity';
import { JobApply } from './job-apply.entity';
import { JobClosureReason } from './job-closure-reason.entity';
import { JobReferral } from './job-referral.entity';
import { ReferralLink } from './referral-link.entity';
import { Web3Event } from './web3-event.entity';

export enum JobStatus {
  PENDING_TO_REVIEW = 'pending_to_review',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum LocationType {
  REMOTE = 'remote',
  ON_SITE = 'on_site',
  HYBRID = 'hybrid',
}

@Entity('jobs')
export class Job extends BaseEntity {
  @Column({ name: 'job_number', type: 'bigint', unique: true })
  @Index()
  jobNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ name: 'experience_level', type: 'int', default: 0 })
  experienceLevel: number;

  @Column({ name: 'management_level', type: 'int', default: 0 })
  managementLevel: number;

  @Column({ name: 'job_type', nullable: true })
  jobType: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ name: 'minimum_qualifications', type: 'text', nullable: true })
  minimumQualifications: string;

  @Column({ name: 'preferred_requirement', type: 'text', nullable: true })
  preferredRequirement: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ name: 'direct_manager', nullable: true })
  directManager: string;

  @Column({ name: 'direct_manager_title', nullable: true })
  directManagerTitle: string;

  @Column({ name: 'direct_manager_profile', nullable: true })
  directManagerProfile: string;

  @Column({ name: 'direct_manager_logo', nullable: true })
  directManagerLogo: string;

  @Column({
    name: 'location_type',
    type: 'enum',
    enum: LocationType,
    default: LocationType.ON_SITE,
  })
  locationType: LocationType;

  @Column({ name: 'location_value', nullable: true })
  locationValue: string;

  @Column({ name: 'salary_from_cents', type: 'bigint', default: 0 })
  salaryFromCents: number;

  @Column({ name: 'salary_from_currency', default: 'USD' })
  salaryFromCurrency: string;

  @Column({ name: 'salary_to_cents', type: 'bigint', default: 0 })
  salaryToCents: number;

  @Column({ name: 'salary_to_currency', default: 'USD' })
  salaryToCurrency: string;

  @Column({ name: 'salary_type', nullable: true })
  salaryType: string;

  @Column({ name: 'referral_cents', type: 'bigint', default: 0 })
  referralCents: number;

  @Column({ name: 'referral_currency', default: 'USD' })
  referralCurrency: string;

  @Column({ name: 'referral_type', nullable: true })
  referralType: string;

  @Column({ name: 'referral_info', type: 'jsonb', nullable: true })
  referralInfo: Record<string, any>;

  @Column({ name: 'apply_method', nullable: true })
  applyMethod: string;

  @Column({ name: 'apply_target', nullable: true })
  applyTarget: string;

  @Column({ name: 'english_level', nullable: true })
  englishLevel: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.PENDING_TO_REVIEW,
  })
  status: JobStatus;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  network: string;

  @Column({ name: 'posted_date', type: 'timestamp', nullable: true })
  postedDate: Date;

  @Column({ name: 'expired_date', type: 'timestamp', nullable: true })
  expiredDate: Date;

  @Column({ name: 'address_token', nullable: true })
  addressToken: string;

  @Column({ name: 'chain_id', nullable: true })
  chainId: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: string;

  @Column({ name: 'speciality_id', nullable: true })
  specialityId: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @Column({ name: 'region_id', nullable: true })
  regionId: string;

  @Column({ name: 'global_region_id', nullable: true })
  globalRegionId: string;

  @Column({ name: 'partner_host_id', nullable: true })
  partnerHostId: string;

  // Relationships
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Speciality, { nullable: true })
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => PartnerHost, { nullable: true })
  @JoinColumn({ name: 'partner_host_id' })
  partnerHost: PartnerHost;

  @OneToMany(() => JobApply, (apply) => apply.job)
  jobApplies: JobApply[];

  @OneToMany(() => JobReferral, (referral) => referral.job)
  jobReferrals: JobReferral[];

  @OneToMany(() => JobClosureReason, (reason) => reason.job)
  jobClosureReasons: JobClosureReason[];

  @OneToMany(() => Web3Event, (event) => event.job)
  web3Events: Web3Event[];

  @OneToMany(() => ReferralLink, (referralLink) => referralLink.job)
  referralLinks: ReferralLink[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'job_skills',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToMany(() => ChoiceOption)
  @JoinTable({
    name: 'job_choice_options',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'choice_option_id', referencedColumnName: 'id' },
  })
  choiceOptions: ChoiceOption[];

  @OneToMany(
    () => PaymentDistribution,
    (paymentDistribution) => paymentDistribution.job
  )
  paymentDistributions: PaymentDistribution[];

  // Static properties
  static readonly FINISHED_STATUS = ['hired', 'closed', 'expired', 'cancelled'];
}

// Alias for easier imports
export { Job as JobEntity };
