# Organization Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Organization domain trong NestJS.

## 🗄️ Database Entities

### 1. Organization Entity

```typescript
// organization.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { City } from '@/modules/location/entities/city.entity';
import { Country } from '@/modules/location/entities/country.entity';
import { Industry } from '@/modules/industry/entities/industry.entity';
import { Job } from '@/modules/job/entities/job.entity';
import { Experience } from '@/modules/talent/entities/experience.entity';
import { Education } from '@/modules/talent/entities/education.entity';

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
  @ManyToOne(() => City, (city) => city.organizations, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Country, (country) => country.organizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Industry, (industry) => industry.organizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @OneToMany(() => Job, (job) => job.organization)
  jobs: Job[];

  @OneToMany(() => Experience, (experience) => experience.organization)
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.organization)
  educations: Education[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;

  @Column({ select: false, insert: false, update: false })
  activeJobsCount?: number;
}
```

### 2. OrganizationLogo Entity (Optional - for complex logo management)

```typescript
// organization-logo.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Organization } from './organization.entity';

@Entity('organization_logos')
export class OrganizationLogo extends BaseEntity {
  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column({ name: 'storage_path' })
  storagePath: string;

  @Column({ name: 'width', nullable: true })
  width: number;

  @Column({ name: 'height', nullable: true })
  height: number;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @OneToOne(() => Organization, (organization) => organization.logo)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
```

### 3. OrganizationSocialLink Entity (Optional - for social media links)

```typescript
// organization-social-link.entity.ts
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
import { Organization } from './organization.entity';

@Entity('organization_social_links')
export class OrganizationSocialLink extends BaseEntity {
  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column()
  platform: string; // github, linkedin, twitter, facebook, instagram

  @Column()
  url: string;

  @Column({ default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization, (organization) => organization.socialLinks)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
```

## 🗄️ Database Migrations

### 1. Create Organizations Table

```typescript
// 1700000000016-CreateOrganizations.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateOrganizations1700000000016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'about', type: 'text', isNullable: true },
          { name: 'address', type: 'varchar', isNullable: true },
          { name: 'contact_email', type: 'varchar', isNullable: true },
          { name: 'contact_phone', type: 'varchar', isNullable: true },
          { name: 'found_date', type: 'date', isNullable: true },
          { name: 'github', type: 'varchar', isNullable: true },
          { name: 'linkedin', type: 'varchar', isNullable: true },
          { name: 'twitter', type: 'varchar', isNullable: true },
          { name: 'website', type: 'varchar', isNullable: true },
          { name: 'org_type', type: 'varchar', isNullable: true },
          { name: 'size', type: 'varchar', isNullable: true },
          { name: 'status', type: 'varchar', default: "'active'" },
          { name: 'logo_url', type: 'varchar', isNullable: true },
          { name: 'logo_filename', type: 'varchar', isNullable: true },
          { name: 'logo_size', type: 'integer', isNullable: true },
          { name: 'logo_content_type', type: 'varchar', isNullable: true },
          { name: 'city_id', type: 'uuid', isNullable: true },
          { name: 'country_id', type: 'uuid', isNullable: true },
          { name: 'industry_id', type: 'uuid', isNullable: true },
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

    await queryRunner.createForeignKey(
      'organizations',
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'organizations',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createForeignKey(
      'organizations',
      new TableForeignKey({
        columnNames: ['industry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industries',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_NAME',
        columnNames: ['name'],
      })
    );
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_STATUS',
        columnNames: ['status'],
      })
    );
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_CITY_ID',
        columnNames: ['city_id'],
      })
    );
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_COUNTRY_ID',
        columnNames: ['country_id'],
      })
    );
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_INDUSTRY_ID',
        columnNames: ['industry_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organizations');
  }
}
```

### 2. Create OrganizationLogos Table (Optional)

```typescript
// 1700000000017-CreateOrganizationLogos.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateOrganizationLogos1700000000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization_logos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'organization_id', type: 'uuid' },
          { name: 'filename', type: 'varchar' },
          { name: 'original_name', type: 'varchar' },
          { name: 'mime_type', type: 'varchar' },
          { name: 'size', type: 'integer' },
          { name: 'url', type: 'varchar' },
          { name: 'storage_path', type: 'varchar' },
          { name: 'width', type: 'integer', isNullable: true },
          { name: 'height', type: 'integer', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
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

    await queryRunner.createForeignKey(
      'organization_logos',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'organization_logos',
      new TableIndex({
        name: 'IDX_ORGANIZATION_LOGOS_ORG_ID',
        columnNames: ['organization_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organization_logos');
  }
}
```

### 3. Create OrganizationSocialLinks Table (Optional)

```typescript
// 1700000000018-CreateOrganizationSocialLinks.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateOrganizationSocialLinks1700000000018
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization_social_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'organization_id', type: 'uuid' },
          { name: 'platform', type: 'varchar' },
          { name: 'url', type: 'varchar' },
          { name: 'is_active', type: 'boolean', default: true },
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

    await queryRunner.createForeignKey(
      'organization_social_links',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'organization_social_links',
      new TableIndex({
        name: 'IDX_ORG_SOCIAL_LINKS_ORG_ID',
        columnNames: ['organization_id'],
      })
    );
    await queryRunner.createIndex(
      'organization_social_links',
      new TableIndex({
        name: 'IDX_ORG_SOCIAL_LINKS_PLATFORM',
        columnNames: ['platform'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organization_social_links');
  }
}
```

## 🔧 Repositories

### 1. Organization Repository

```typescript
// organization.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {
    super(organizationRepository);
  }

  async findByName(name: string): Promise<Organization | null> {
    return this.organizationRepository.findOne({ where: { name } });
  }

  async findByIndustry(industryId: string): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { industryId },
      relations: ['industry', 'city', 'country'],
    });
  }

  async findByLocation(
    cityId?: string,
    countryId?: string
  ): Promise<Organization[]> {
    const queryBuilder = this.organizationRepository
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country');

    if (cityId) {
      queryBuilder.andWhere('org.cityId = :cityId', { cityId });
    }

    if (countryId) {
      queryBuilder.andWhere('org.countryId = :countryId', { countryId });
    }

    return queryBuilder.getMany();
  }

  async searchByName(query: string): Promise<Organization[]> {
    return this.organizationRepository
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .where('org.name ILIKE :query OR org.about ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('org.name', 'ASC')
      .getMany();
  }

  async findWithStats(): Promise<Organization[]> {
    return this.organizationRepository
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .addSelect('COUNT(jobs.id)', 'jobsCount')
      .addSelect(
        'COUNT(CASE WHEN jobs.status = :activeStatus THEN 1 END)',
        'activeJobsCount'
      )
      .leftJoin('org.jobs', 'jobs')
      .groupBy('org.id')
      .addGroupBy('industry.id')
      .addGroupBy('city.id')
      .addGroupBy('country.id')
      .setParameter('activeStatus', 'active')
      .getMany();
  }

  async findActiveOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { status: 'active' },
      relations: ['industry', 'city', 'country'],
    });
  }
}
```

### 2. OrganizationLogo Repository (Optional)

```typescript
// organization-logo.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationLogo } from './entities/organization-logo.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class OrganizationLogoRepository extends BaseRepository<OrganizationLogo> {
  constructor(
    @InjectRepository(OrganizationLogo)
    private readonly organizationLogoRepository: Repository<OrganizationLogo>
  ) {
    super(organizationLogoRepository);
  }

  async findByOrganization(
    organizationId: string
  ): Promise<OrganizationLogo | null> {
    return this.organizationLogoRepository.findOne({
      where: { organizationId, isActive: true },
    });
  }

  async deactivateOldLogos(organizationId: string): Promise<void> {
    await this.organizationLogoRepository.update(
      { organizationId },
      { isActive: false }
    );
  }
}
```

### 3. OrganizationSocialLink Repository (Optional)

```typescript
// organization-social-link.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationSocialLink } from './entities/organization-social-link.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class OrganizationSocialLinkRepository extends BaseRepository<OrganizationSocialLink> {
  constructor(
    @InjectRepository(OrganizationSocialLink)
    private readonly organizationSocialLinkRepository: Repository<OrganizationSocialLink>
  ) {
    super(organizationSocialLinkRepository);
  }

  async findByOrganization(
    organizationId: string
  ): Promise<OrganizationSocialLink[]> {
    return this.organizationSocialLinkRepository.find({
      where: { organizationId, isActive: true },
    });
  }

  async findByPlatform(
    organizationId: string,
    platform: string
  ): Promise<OrganizationSocialLink | null> {
    return this.organizationSocialLinkRepository.findOne({
      where: { organizationId, platform, isActive: true },
    });
  }
}
```

## 🔍 Search Implementation

### 1. Full-Text Search with PostgreSQL

```typescript
// organization-search.service.ts
@Injectable()
export class OrganizationSearchService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>
  ) {}

  async searchOrganizations(
    query: string,
    filters?: any
  ): Promise<Organization[]> {
    const queryBuilder = this.organizationRepository
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.industry', 'industry')
      .leftJoinAndSelect('org.city', 'city')
      .leftJoinAndSelect('org.country', 'country')
      .leftJoinAndSelect('org.logo', 'logo');

    // Full-text search using PostgreSQL
    if (query) {
      queryBuilder.where(
        `(
          to_tsvector('english', org.name) @@ plainto_tsquery('english', :query) OR
          to_tsvector('english', org.about) @@ plainto_tsquery('english', :query) OR
          org.name ILIKE :likeQuery OR
          org.about ILIKE :likeQuery
        )`,
        { query, likeQuery: `%${query}%` }
      );
    }

    // Apply filters
    if (filters) {
      if (filters.industry) {
        queryBuilder.andWhere('industry.id = :industry', {
          industry: filters.industry,
        });
      }
      if (filters.country) {
        queryBuilder.andWhere('country.id = :country', {
          country: filters.country,
        });
      }
      if (filters.city) {
        queryBuilder.andWhere('city.id = :city', { city: filters.city });
      }
      if (filters.size) {
        queryBuilder.andWhere('org.size = :size', { size: filters.size });
      }
      if (filters.orgType) {
        queryBuilder.andWhere('org.orgType = :orgType', {
          orgType: filters.orgType,
        });
      }
      if (filters.status) {
        queryBuilder.andWhere('org.status = :status', {
          status: filters.status,
        });
      }
    }

    return queryBuilder.orderBy('org.name', 'ASC').getMany();
  }
}
```

---

## 📋 Checklist

- [ ] Organization Entity
- [ ] OrganizationLogo Entity (Optional)
- [ ] OrganizationSocialLink Entity (Optional)
- [ ] Database Migrations
- [ ] Organization Repository
- [ ] OrganizationLogo Repository (Optional)
- [ ] OrganizationSocialLink Repository (Optional)
- [ ] Search Implementation
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
