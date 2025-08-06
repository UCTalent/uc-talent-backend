import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/database/base.entity';
import { Organization } from '@organization/entities/organization.entity';
import { Speciality } from '@skill/entities/speciality.entity';
import { City } from '@location/entities/city.entity';
import { Country } from '@location/entities/country.entity';
import { Region } from '@location/entities/region.entity';
import { PartnerHost } from '@partner/entities/partner-host.entity';
import { JobApply } from './job-apply.entity';
import { JobReferral } from './job-referral.entity';
import { JobClosureReason } from './job-closure-reason.entity';
import { Web3Event } from './web3-event.entity';
import { Skill } from '@skill/entities/skill.entity';
import { ChoiceOption } from './choice-option.entity';
import { ReferralLink } from './referral-link.entity';

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
  @Column({ type: 'bigint', unique: true })
  @Index()
  jobNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'int', default: 0 })
  experienceLevel: number;

  @Column({ type: 'int', default: 0 })
  managementLevel: number;

  @Column({ nullable: true })
  jobType: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'text', nullable: true })
  minimumQualifications: string;

  @Column({ type: 'text', nullable: true })
  preferredRequirement: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ nullable: true })
  directManager: string;

  @Column({ nullable: true })
  directManagerTitle: string;

  @Column({ nullable: true })
  directManagerProfile: string;

  @Column({ nullable: true })
  directManagerLogo: string;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.ON_SITE,
  })
  locationType: LocationType;

  @Column({ nullable: true })
  locationValue: string;

  @Column({ type: 'bigint', default: 0 })
  salaryFromCents: number;

  @Column({ default: 'USD' })
  salaryFromCurrency: string;

  @Column({ type: 'bigint', default: 0 })
  salaryToCents: number;

  @Column({ default: 'USD' })
  salaryToCurrency: string;

  @Column({ nullable: true })
  salaryType: string;

  @Column({ type: 'bigint', default: 0 })
  referralCents: number;

  @Column({ default: 'USD' })
  referralCurrency: string;

  @Column({ nullable: true })
  referralType: string;

  @Column({ type: 'jsonb', nullable: true })
  referralInfo: Record<string, any>;

  @Column({ nullable: true })
  applyMethod: string;

  @Column({ nullable: true })
  applyTarget: string;

  @Column({ nullable: true })
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

  @Column({ type: 'timestamp', nullable: true })
  postedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiredDate: Date;

  @Column({ nullable: true })
  addressToken: string;

  @Column({ nullable: true })
  chainId: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ nullable: true })
  organizationId: string;

  @Column({ nullable: true })
  specialityId: string;

  @Column({ nullable: true })
  cityId: string;

  @Column({ nullable: true })
  countryId: string;

  @Column({ nullable: true })
  regionId: string;

  @Column({ nullable: true })
  globalRegionId: string;

  @Column({ nullable: true })
  partnerHostId: string;

  // Relationships
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => Speciality, { nullable: true })
  @JoinColumn({ name: 'specialityId' })
  speciality: Speciality;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @ManyToOne(() => PartnerHost, { nullable: true })
  @JoinColumn({ name: 'partnerHostId' })
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
    joinColumn: { name: 'jobId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToMany(() => ChoiceOption)
  @JoinTable({
    name: 'job_choice_options',
    joinColumn: { name: 'jobId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'choiceOptionId', referencedColumnName: 'id' },
  })
  choiceOptions: ChoiceOption[];

  // Static properties
  static readonly FINISHED_STATUS = ['hired', 'closed', 'expired', 'cancelled'];
}

// Alias for easier imports
export { Job as JobEntity }; 