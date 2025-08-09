# Job Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Job domain trong NestJS.

## 🗄️ Database Entities

### 1. Job Entity

```typescript
// job.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Speciality } from '@/modules/skill/entities/speciality.entity';
import { Skill } from '@/modules/skill/entities/skill.entity';
import { City } from '@/modules/location/entities/city.entity';
import { Country } from '@/modules/location/entities/country.entity';
import { Region } from '@/modules/location/entities/region.entity';
import { PartnerHost } from '@/modules/partner/entities/partner-host.entity';
import { JobApply } from './job-apply.entity';
import { JobReferral } from './job-referral.entity';
import { ReferralLink } from './referral-link.entity';
import { JobClosureReason } from './job-closure-reason.entity';
import { Web3Event } from '@/modules/payment/entities/web3-event.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column({ name: 'job_number', unique: true })
  @Index()
  jobNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  responsibilities: string;

  @Column({ name: 'minimum_qualifications', type: 'text' })
  minimumQualifications: string;

  @Column({ name: 'preferred_requirement', type: 'text' })
  preferredRequirement: string;

  @Column({ type: 'text' })
  benefits: string;

  @Column({ name: 'experience_level' })
  experienceLevel: number;

  @Column({ name: 'management_level' })
  managementLevel: number;

  @Column({ name: 'job_type' })
  jobType: string;

  @Column({ name: 'location_type' })
  locationType: string;

  @Column({ name: 'location_value' })
  locationValue: string;

  @Column({ name: 'salary_from_cents' })
  salaryFromCents: number;

  @Column({ name: 'salary_to_cents' })
  salaryToCents: number;

  @Column({ name: 'salary_currency' })
  salaryCurrency: string;

  @Column({ name: 'salary_type' })
  salaryType: string;

  @Column({ name: 'referral_cents' })
  referralCents: number;

  @Column({ name: 'referral_currency' })
  referralCurrency: string;

  @Column({ name: 'referral_type' })
  referralType: string;

  @Column({ name: 'referral_info', type: 'jsonb', nullable: true })
  referralInfo: any;

  @Column()
  status: string;

  @Column({ name: 'posted_date' })
  postedDate: Date;

  @Column({ name: 'expired_date' })
  expiredDate: Date;

  @Column({ name: 'direct_manager', nullable: true })
  directManager: string;

  @Column({ name: 'direct_manager_title', nullable: true })
  directManagerTitle: string;

  @Column({ name: 'direct_manager_profile', type: 'text', nullable: true })
  directManagerProfile: string;

  @Column({ name: 'direct_manager_logo', nullable: true })
  directManagerLogo: string;

  @Column({ name: 'english_level' })
  englishLevel: string;

  @Column({ name: 'apply_method' })
  applyMethod: string;

  @Column({ name: 'apply_target' })
  applyTarget: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by' })
  updatedBy: string;

  // Foreign Keys
  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'speciality_id' })
  specialityId: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @Column({ name: 'region_id', nullable: true })
  regionId: string;

  @Column({ name: 'partner_host_id', nullable: true })
  partnerHostId: string;

  // Relationships
  @ManyToOne(() => Organization, (organization) => organization.jobs)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Speciality, (speciality) => speciality.jobs)
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @ManyToOne(() => City, (city) => city.jobs)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Country, (country) => country.jobs)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Region, (region) => region.jobs)
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => PartnerHost, (partnerHost) => partnerHost.jobs)
  @JoinColumn({ name: 'partner_host_id' })
  partnerHost: PartnerHost;

  @ManyToMany(() => Skill, (skill) => skill.jobs)
  @JoinTable({
    name: 'jobs_skills',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => JobApply, (jobApply) => jobApply.job)
  jobApplies: JobApply[];

  @OneToMany(() => JobReferral, (jobReferral) => jobReferral.job)
  jobReferrals: JobReferral[];

  @OneToMany(() => ReferralLink, (referralLink) => referralLink.job)
  referralLinks: ReferralLink[];

  @OneToMany(() => JobClosureReason, (closureReason) => closureReason.job)
  closureReasons: JobClosureReason[];

  @OneToMany(() => Web3Event, (web3Event) => web3Event.job)
  web3Events: Web3Event[];

  // Static properties
  static readonly FINISHED_STATUS = ['hired', 'closed', 'expired', 'cancelled'];
}
```

### 2. Job Apply Entity

```typescript
// job-apply.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Job } from './job.entity';
import { Talent } from '@/modules/talent/entities/talent.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { UploadedResume } from '@/modules/talent/entities/uploaded-resume.entity';

@Entity('job_applies')
export class JobApply extends BaseEntity {
  @Column()
  status: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ name: 'rejected_note', type: 'text', nullable: true })
  rejectedNote: string;

  @Column({ name: 'job_referral_id', nullable: true })
  jobReferralId: string;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'uploaded_resume_id', nullable: true })
  uploadedResumeId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.jobApplies)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Talent, (talent) => talent.jobApplies)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => Organization, (organization) => organization.jobApplies)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => UploadedResume, (resume) => resume.jobApplies)
  @JoinColumn({ name: 'uploaded_resume_id' })
  uploadedResume: UploadedResume;
}
```

### 3. Job Referral Entity

```typescript
// job-referral.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Job } from './job.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('job_referrals')
export class JobReferral extends BaseEntity {
  @Column({ name: 'candidate_name' })
  candidateName: string;

  @Column({ name: 'candidate_email' })
  candidateEmail: string;

  @Column({ name: 'candidate_phonenumber', nullable: true })
  candidatePhonenumber: string;

  @Column({ name: 'candidate_introduction', type: 'text', nullable: true })
  candidateIntroduction: string;

  @Column({ name: 'candidate_resume', type: 'bytea', nullable: true })
  candidateResume: Buffer;

  @Column({ name: 'candidate_resume_filename', nullable: true })
  candidateResumeFilename: string;

  @Column({ name: 'candidate_resume_content_type', nullable: true })
  candidateResumeContentType: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({ name: 'web3_signature', nullable: true })
  web3Signature: string;

  @Column({ name: 'web3_chain_name', nullable: true })
  web3ChainName: string;

  @Column()
  status: string;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'referrer_id' })
  referrerId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.jobReferrals)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, (user) => user.jobReferrals)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;
}
```

### 4. Referral Link Entity

```typescript
// referral-link.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Job } from './job.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('referral_links')
export class ReferralLink extends BaseEntity {
  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'referrer_id' })
  referrerId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.referralLinks)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, (user) => user.referralLinks)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;
}
```

### 5. Job Closure Reason Entity

```typescript
// job-closure-reason.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Job } from './job.entity';

@Entity('job_closure_reasons')
export class JobClosureReason extends BaseEntity {
  @Column({ name: 'other_reason', type: 'text', nullable: true })
  otherReason: string;

  @Column({ name: 'choice_options', type: 'text', array: true, default: [] })
  choiceOptions: string[];

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.closureReasons)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
```

## 🗄️ Database Migrations

### 1. Create Jobs Table

```typescript
// 1700000000002-CreateJobs.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateJobs1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_number',
            type: 'integer',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'about',
            type: 'text',
          },
          {
            name: 'responsibilities',
            type: 'text',
          },
          {
            name: 'minimum_qualifications',
            type: 'text',
          },
          {
            name: 'preferred_requirement',
            type: 'text',
          },
          {
            name: 'benefits',
            type: 'text',
          },
          {
            name: 'experience_level',
            type: 'integer',
          },
          {
            name: 'management_level',
            type: 'integer',
          },
          {
            name: 'job_type',
            type: 'varchar',
          },
          {
            name: 'location_type',
            type: 'varchar',
          },
          {
            name: 'location_value',
            type: 'varchar',
          },
          {
            name: 'salary_from_cents',
            type: 'integer',
          },
          {
            name: 'salary_to_cents',
            type: 'integer',
          },
          {
            name: 'salary_currency',
            type: 'varchar',
          },
          {
            name: 'salary_type',
            type: 'varchar',
          },
          {
            name: 'referral_cents',
            type: 'integer',
          },
          {
            name: 'referral_currency',
            type: 'varchar',
          },
          {
            name: 'referral_type',
            type: 'varchar',
          },
          {
            name: 'referral_info',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'posted_date',
            type: 'timestamp',
          },
          {
            name: 'expired_date',
            type: 'timestamp',
          },
          {
            name: 'direct_manager',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'direct_manager_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'direct_manager_profile',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'direct_manager_logo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'english_level',
            type: 'varchar',
          },
          {
            name: 'apply_method',
            type: 'varchar',
          },
          {
            name: 'apply_target',
            type: 'varchar',
          },
          {
            name: 'created_by',
            type: 'uuid',
          },
          {
            name: 'updated_by',
            type: 'uuid',
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'speciality_id',
            type: 'uuid',
          },
          {
            name: 'city_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'country_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'region_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'partner_host_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['speciality_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialities',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['region_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'regions',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['partner_host_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partner_hosts',
        onDelete: 'SET NULL',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_JOB_NUMBER',
        columnNames: ['job_number'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_STATUS',
        columnNames: ['status'],
      })
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_POSTED_DATE',
        columnNames: ['posted_date'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}
```

### 2. Create Job Applies Table

```typescript
// 1700000000003-CreateJobApplies.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateJobApplies1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'job_applies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'headline',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'rejected_note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'job_referral_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'uploaded_resume_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['uploaded_resume_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'uploaded_resumes',
        onDelete: 'SET NULL',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'job_applies',
      new TableIndex({
        name: 'IDX_JOB_APPLIES_JOB_TALENT',
        columnNames: ['job_id', 'talent_id'],
      })
    );

    await queryRunner.createIndex(
      'job_applies',
      new TableIndex({
        name: 'IDX_JOB_APPLIES_STATUS',
        columnNames: ['status'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('job_applies');
  }
}
```

## 🔧 Repositories

### 1. Job Repository

```typescript
// job.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class JobRepository extends BaseRepository<Job> {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>
  ) {
    super(jobRepository);
  }

  async findByStatus(status: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { status },
      relations: ['organization', 'speciality', 'skills'],
    });
  }

  async findByOrganization(organizationId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { organizationId },
      relations: ['speciality', 'skills'],
    });
  }

  async findByPartnerHost(partnerHostId: string): Promise<Job[]> {
    return this.jobRepository.find({
      where: { partnerHostId },
      relations: ['organization', 'speciality'],
    });
  }

  async findWithFilters(filters: any): Promise<[Job[], number]> {
    const queryBuilder = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .leftJoinAndSelect('job.skills', 'skills');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('job.status = :status', { status: filters.status });
    }

    if (filters.organizationId) {
      queryBuilder.andWhere('job.organizationId = :organizationId', {
        organizationId: filters.organizationId,
      });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', {
        experienceLevel: filters.experienceLevel,
      });
    }

    if (filters.jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', {
        jobType: filters.jobType,
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findSimilarJobs(jobId: string, limit: number = 10): Promise<Job[]> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['speciality', 'skills'],
    });

    if (!job) return [];

    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.organization', 'organization')
      .leftJoinAndSelect('job.speciality', 'speciality')
      .where('job.id != :jobId', { jobId })
      .andWhere('job.status = :status', { status: 'published' })
      .andWhere('job.specialityId = :specialityId', {
        specialityId: job.specialityId,
      })
      .orderBy('job.postedDate', 'DESC')
      .limit(limit)
      .getMany();
  }
}
```

### 2. Job Apply Repository

```typescript
// job-apply.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApply } from './entities/job-apply.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class JobApplyRepository extends BaseRepository<JobApply> {
  constructor(
    @InjectRepository(JobApply)
    private readonly jobApplyRepository: Repository<JobApply>
  ) {
    super(jobApplyRepository);
  }

  async findByJobAndTalent(
    jobId: string,
    talentId: string
  ): Promise<JobApply | null> {
    return this.jobApplyRepository.findOne({
      where: { jobId, talentId },
      relations: ['job', 'talent', 'uploadedResume'],
    });
  }

  async findByTalent(talentId: string): Promise<JobApply[]> {
    return this.jobApplyRepository.find({
      where: { talentId },
      relations: ['job', 'job.organization'],
    });
  }

  async findByJob(jobId: string): Promise<JobApply[]> {
    return this.jobApplyRepository.find({
      where: { jobId },
      relations: ['talent', 'uploadedResume'],
    });
  }

  async findByStatus(status: string): Promise<JobApply[]> {
    return this.jobApplyRepository.find({
      where: { status },
      relations: ['job', 'talent'],
    });
  }
}
```

---

## 📋 Checklist

- [ ] Job Entity
- [ ] Job Apply Entity
- [ ] Job Referral Entity
- [ ] Referral Link Entity
- [ ] Job Closure Reason Entity
- [ ] Database Migrations
- [ ] Job Repository
- [ ] Job Apply Repository
- [ ] Job Referral Repository
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
