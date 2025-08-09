# Talent Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Talent domain trong NestJS.

## 🗄️ Database Entities

### 1. Talent Entity

```typescript
// talent.entity.ts
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
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Speciality } from '@/modules/skill/entities/speciality.entity';
import { Skill } from '@/modules/skill/entities/skill.entity';
import { Role } from '@/modules/skill/entities/role.entity';
import { Experience } from './experience.entity';
import { Education } from './education.entity';
import { ExternalLink } from './external-link.entity';
import { UploadedResume } from './uploaded-resume.entity';
import { RecommendationJob } from '@/modules/job/entities/recommendation-job.entity';

@Entity('talents')
export class Talent extends BaseEntity {
  @Column({ nullable: true })
  headline: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ name: 'employment_status' })
  employmentStatus: string;

  @Column({ name: 'english_proficiency' })
  englishProficiency: string;

  @Column({ name: 'experience_level' })
  experienceLevel: number;

  @Column({ name: 'management_level', default: 0 })
  managementLevel: number;

  @Column()
  status: string;

  @Column({ default: 0 })
  step: number;

  @Column({ name: 'job_recommendation_frequency', default: 'default' })
  jobRecommendationFrequency: string;

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.talent)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Speciality, (speciality) => speciality.talents)
  @JoinTable({
    name: 'talents_specialities',
    joinColumn: { name: 'talent_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'speciality_id', referencedColumnName: 'id' },
  })
  specialities: Speciality[];

  @ManyToMany(() => Skill, (skill) => skill.talents)
  @JoinTable({
    name: 'talents_skills',
    joinColumn: { name: 'talent_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToMany(() => Role, (role) => role.talents)
  @JoinTable({
    name: 'talents_roles',
    joinColumn: { name: 'talent_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Experience, (experience) => experience.talent)
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.talent)
  educations: Education[];

  @OneToMany(() => ExternalLink, (externalLink) => externalLink.talent)
  externalLinks: ExternalLink[];

  @OneToMany(() => UploadedResume, (uploadedResume) => uploadedResume.talent)
  uploadedResumes: UploadedResume[];

  @OneToMany(
    () => RecommendationJob,
    (recommendationJob) => recommendationJob.talent
  )
  recommendationJobs: RecommendationJob[];

  // Methods
  getJobRecommendationFrequency(): string {
    if (this.jobRecommendationFrequency !== 'default') {
      return this.jobRecommendationFrequency;
    }

    const defaultFrequencies = {
      available_now: 'weekly',
      open_to_opportunities: 'monthly',
      just_browsing: 'monthly',
    };

    return defaultFrequencies[this.employmentStatus] || 'monthly';
  }

  getLastRecommendationSent(): Date {
    if (this.recommendationJobs?.length) {
      const sortedJobs = this.recommendationJobs.sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );
      return sortedJobs[0].sentAt;
    }
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  }
}
```

### 2. Experience Entity

```typescript
// experience.entity.ts
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
import { Talent } from './talent.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';

@Entity('experiences')
export class Experience extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ name: 'job_type' })
  jobType: string;

  @Column({ name: 'is_currently_working', default: false })
  isCurrentlyWorking: boolean;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ name: 'job_description', type: 'text', nullable: true })
  jobDescription: string;

  // Foreign Keys
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.experiences)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => Organization, (organization) => organization.experiences)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
```

### 3. Education Entity

```typescript
// education.entity.ts
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
import { Talent } from './talent.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';

@Entity('educations')
export class Education extends BaseEntity {
  @Column({ name: 'school_name', nullable: true })
  schoolName: string;

  @Column({ nullable: true })
  degree: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Foreign Keys
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.educations)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => Organization, (organization) => organization.educations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
```

### 4. External Link Entity

```typescript
// external-link.entity.ts
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
import { Talent } from './talent.entity';

@Entity('external_links')
export class ExternalLink extends BaseEntity {
  @Column()
  platform: string;

  @Column()
  url: string;

  // Foreign Keys
  @Column({ name: 'talent_id' })
  talentId: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.externalLinks)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
```

### 5. Uploaded Resume Entity

```typescript
// uploaded-resume.entity.ts
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
import { Talent } from './talent.entity';

@Entity('uploaded_resumes')
export class UploadedResume extends BaseEntity {
  @Column()
  filename: string;

  @Column({ name: 'original_filename' })
  originalFilename: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @Column({ name: 'content_type' })
  contentType: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column()
  status: string;

  // Foreign Keys
  @Column({ name: 'talent_id' })
  talentId: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.uploadedResumes)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;
}
```

### 6. Recommendation Job Entity

```typescript
// recommendation-job.entity.ts
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
import { Talent } from './talent.entity';
import { Job } from '@/modules/job/entities/job.entity';

@Entity('recommendation_jobs')
export class RecommendationJob extends BaseEntity {
  @Column({ name: 'sent_at' })
  sentAt: Date;

  @Column({ name: 'is_viewed', default: false })
  isViewed: boolean;

  @Column({ name: 'viewed_at', nullable: true })
  viewedAt: Date;

  // Foreign Keys
  @Column({ name: 'talent_id' })
  talentId: string;

  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Talent, (talent) => talent.recommendationJobs)
  @JoinColumn({ name: 'talent_id' })
  talent: Talent;

  @ManyToOne(() => Job, (job) => job.recommendationJobs)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
```

## 🗄️ Database Migrations

### 1. Create Talents Table

```typescript
// 1700000000004-CreateTalents.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateTalents1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'talents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'headline',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'employment_status',
            type: 'varchar',
          },
          {
            name: 'english_proficiency',
            type: 'varchar',
          },
          {
            name: 'experience_level',
            type: 'integer',
          },
          {
            name: 'management_level',
            type: 'integer',
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'step',
            type: 'integer',
            default: 0,
          },
          {
            name: 'job_recommendation_frequency',
            type: 'varchar',
            default: "'default'",
          },
          {
            name: 'user_id',
            type: 'uuid',
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
      'talents',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_USER_ID',
        columnNames: ['user_id'],
      })
    );

    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_STATUS',
        columnNames: ['status'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('talents');
  }
}
```

### 2. Create Experiences Table

```typescript
// 1700000000005-CreateExperiences.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateExperiences1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'experiences',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'job_type',
            type: 'varchar',
          },
          {
            name: 'is_currently_working',
            type: 'boolean',
            default: false,
          },
          {
            name: 'start_time',
            type: 'timestamp',
          },
          {
            name: 'end_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'job_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'organization_id',
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
      'experiences',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'experiences',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'SET NULL',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'experiences',
      new TableIndex({
        name: 'IDX_EXPERIENCES_TALENT_ID',
        columnNames: ['talent_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('experiences');
  }
}
```

### 3. Create Educations Table

```typescript
// 1700000000006-CreateEducations.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateEducations1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'educations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'school_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'degree',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'start_time',
            type: 'timestamp',
          },
          {
            name: 'end_time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'organization_id',
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
      'educations',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'educations',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'SET NULL',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'educations',
      new TableIndex({
        name: 'IDX_EDUCATIONS_TALENT_ID',
        columnNames: ['talent_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('educations');
  }
}
```

### 4. Create External Links Table

```typescript
// 1700000000007-CreateExternalLinks.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateExternalLinks1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'external_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'platform',
            type: 'varchar',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'talent_id',
            type: 'uuid',
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
      'external_links',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'external_links',
      new TableIndex({
        name: 'IDX_EXTERNAL_LINKS_TALENT_PLATFORM',
        columnNames: ['talent_id', 'platform'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('external_links');
  }
}
```

### 5. Create Uploaded Resumes Table

```typescript
// 1700000000008-CreateUploadedResumes.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateUploadedResumes1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'uploaded_resumes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'original_filename',
            type: 'varchar',
          },
          {
            name: 'file_size',
            type: 'integer',
          },
          {
            name: 'content_type',
            type: 'varchar',
          },
          {
            name: 'file_path',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'talent_id',
            type: 'uuid',
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
      'uploaded_resumes',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'uploaded_resumes',
      new TableIndex({
        name: 'IDX_UPLOADED_RESUMES_TALENT_ID',
        columnNames: ['talent_id'],
      })
    );

    await queryRunner.createIndex(
      'uploaded_resumes',
      new TableIndex({
        name: 'IDX_UPLOADED_RESUMES_STATUS',
        columnNames: ['status'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('uploaded_resumes');
  }
}
```

## 🔧 Repositories

### 1. Talent Repository

```typescript
// talent.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entities/talent.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class TalentRepository extends BaseRepository<Talent> {
  constructor(
    @InjectRepository(Talent)
    private readonly talentRepository: Repository<Talent>
  ) {
    super(talentRepository);
  }

  async findByUserId(userId: string): Promise<Talent | null> {
    return this.talentRepository.findOne({
      where: { userId },
      relations: [
        'user',
        'specialities',
        'skills',
        'roles',
        'experiences',
        'educations',
        'externalLinks',
        'uploadedResumes',
      ],
    });
  }

  async findByStatus(status: string): Promise<Talent[]> {
    return this.talentRepository.find({
      where: { status },
      relations: ['user', 'specialities', 'skills'],
    });
  }

  async findWithFilters(filters: any): Promise<[Talent[], number]> {
    const queryBuilder = this.talentRepository
      .createQueryBuilder('talent')
      .leftJoinAndSelect('talent.user', 'user')
      .leftJoinAndSelect('talent.specialities', 'specialities')
      .leftJoinAndSelect('talent.skills', 'skills');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('talent.status = :status', {
        status: filters.status,
      });
    }

    if (filters.employmentStatus) {
      queryBuilder.andWhere('talent.employmentStatus = :employmentStatus', {
        employmentStatus: filters.employmentStatus,
      });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('talent.experienceLevel = :experienceLevel', {
        experienceLevel: filters.experienceLevel,
      });
    }

    if (filters.specialityIds?.length) {
      queryBuilder.andWhere('specialities.id IN (:...specialityIds)', {
        specialityIds: filters.specialityIds,
      });
    }

    if (filters.skillIds?.length) {
      queryBuilder.andWhere('skills.id IN (:...skillIds)', {
        skillIds: filters.skillIds,
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findForJobRecommendations(frequency: string): Promise<Talent[]> {
    return this.talentRepository
      .createQueryBuilder('talent')
      .leftJoinAndSelect('talent.user', 'user')
      .leftJoinAndSelect('talent.specialities', 'specialities')
      .leftJoinAndSelect('talent.skills', 'skills')
      .where('talent.status = :status', { status: 'active' })
      .andWhere('talent.employmentStatus IN (:...statuses)', {
        statuses: ['available_now', 'open_to_opportunities'],
      })
      .getMany();
  }
}
```

### 2. Experience Repository

```typescript
// experience.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class ExperienceRepository extends BaseRepository<Experience> {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>
  ) {
    super(experienceRepository);
  }

  async findByTalentId(talentId: string): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { talentId },
      relations: ['organization'],
      order: { startTime: 'DESC' },
    });
  }

  async findByTalentAndId(
    talentId: string,
    id: string
  ): Promise<Experience | null> {
    return this.experienceRepository.findOne({
      where: { id, talentId },
      relations: ['organization'],
    });
  }
}
```

### 3. Education Repository

```typescript
// education.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class EducationRepository extends BaseRepository<Education> {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>
  ) {
    super(educationRepository);
  }

  async findByTalentId(talentId: string): Promise<Education[]> {
    return this.educationRepository.find({
      where: { talentId },
      relations: ['organization'],
      order: { startTime: 'DESC' },
    });
  }

  async findByTalentAndId(
    talentId: string,
    id: string
  ): Promise<Education | null> {
    return this.educationRepository.findOne({
      where: { id, talentId },
      relations: ['organization'],
    });
  }
}
```

### 4. External Link Repository

```typescript
// external-link.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExternalLink } from './entities/external-link.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class ExternalLinkRepository extends BaseRepository<ExternalLink> {
  constructor(
    @InjectRepository(ExternalLink)
    private readonly externalLinkRepository: Repository<ExternalLink>
  ) {
    super(externalLinkRepository);
  }

  async findByTalentId(talentId: string): Promise<ExternalLink[]> {
    return this.externalLinkRepository.find({
      where: { talentId },
      order: { platform: 'ASC' },
    });
  }

  async findByTalentAndPlatform(
    talentId: string,
    platform: string
  ): Promise<ExternalLink | null> {
    return this.externalLinkRepository.findOne({
      where: { talentId, platform },
    });
  }
}
```

### 5. Uploaded Resume Repository

```typescript
// uploaded-resume.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedResume } from './entities/uploaded-resume.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class UploadedResumeRepository extends BaseRepository<UploadedResume> {
  constructor(
    @InjectRepository(UploadedResume)
    private readonly uploadedResumeRepository: Repository<UploadedResume>
  ) {
    super(uploadedResumeRepository);
  }

  async findByTalentId(talentId: string): Promise<UploadedResume[]> {
    return this.uploadedResumeRepository.find({
      where: { talentId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByTalentId(talentId: string): Promise<UploadedResume[]> {
    return this.uploadedResumeRepository.find({
      where: { talentId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTalentAndId(
    talentId: string,
    id: string
  ): Promise<UploadedResume | null> {
    return this.uploadedResumeRepository.findOne({
      where: { id, talentId },
    });
  }
}
```

---

## 📋 Checklist

- [ ] Talent Entity
- [ ] Experience Entity
- [ ] Education Entity
- [ ] External Link Entity
- [ ] Uploaded Resume Entity
- [ ] Recommendation Job Entity
- [ ] Database Migrations
- [ ] Talent Repository
- [ ] Experience Repository
- [ ] Education Repository
- [ ] External Link Repository
- [ ] Uploaded Resume Repository
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
