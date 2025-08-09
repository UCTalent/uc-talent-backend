# Partner Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Partner domain trong NestJS.

## 🗄️ Database Entities

### 1. Partner Entity

```typescript
// partner.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { PartnerHost } from './partner-host.entity';

@Entity('partners')
export class Partner extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ name: 'is_uc_talent', default: false })
  isUcTalent: boolean;

  // Relationships
  @OneToMany(() => PartnerHost, (partnerHost) => partnerHost.partner)
  partnerHosts: PartnerHost[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  hostsCount?: number;

  @Column({ select: false, insert: false, update: false })
  networksCount?: number;

  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;
}
```

### 2. PartnerHost Entity

```typescript
// partner-host.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Partner } from './partner.entity';
import { PartnerHostNetwork } from './partner-host-network.entity';
import { Job } from '@/modules/job/entities/job.entity';

@Entity('partner_hosts')
export class PartnerHost extends BaseEntity {
  @Column({ unique: true })
  @Index()
  host: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ name: 'access_token', unique: true })
  @Index()
  accessToken: string;

  @Column({ name: 'is_uc_talent', default: false })
  isUcTalent: boolean;

  // Foreign Keys
  @Column({ name: 'partner_id' })
  partnerId: string;

  // Relationships
  @ManyToOne(() => Partner, (partner) => partner.partnerHosts)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @OneToMany(() => PartnerHostNetwork, (network) => network.partnerHost)
  networks: PartnerHostNetwork[];

  @OneToMany(() => Job, (job) => job.partnerHost)
  jobs: Job[];

  // Virtual fields for computed properties
  @Column({ select: false, insert: false, update: false })
  jobsCount?: number;

  @Column({ select: false, insert: false, update: false })
  networksCount?: number;
}
```

### 3. PartnerHostNetwork Entity

```typescript
// partner-host-network.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { PartnerHost } from './partner-host.entity';

export enum NetworkType {
  COTI_V2 = 'coti_v2',
  BASE = 'base',
  BNB = 'bnb',
  ETHEREUM = 'ethereum',
}

@Entity('partner_host_networks')
export class PartnerHostNetwork extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NetworkType,
  })
  @Index()
  network: NetworkType;

  @Column({ default: false })
  default: boolean;

  // Foreign Keys
  @Column({ name: 'partner_host_id' })
  partnerHostId: string;

  // Relationships
  @ManyToOne(() => PartnerHost, (partnerHost) => partnerHost.networks)
  @JoinColumn({ name: 'partner_host_id' })
  partnerHost: PartnerHost;
}
```

## 🗄️ Database Migrations

### 1. Create Partners Table

```typescript
// 1700000000019-CreatePartners.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePartners1700000000019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'partners',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'is_uc_talent', type: 'boolean', default: false },
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

    await queryRunner.createIndex(
      'partners',
      new TableIndex({
        name: 'IDX_PARTNERS_NAME',
        columnNames: ['name'],
      })
    );
    await queryRunner.createIndex(
      'partners',
      new TableIndex({
        name: 'IDX_PARTNERS_SLUG',
        columnNames: ['slug'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('partners');
  }
}
```

### 2. Create PartnerHosts Table

```typescript
// 1700000000020-CreatePartnerHosts.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreatePartnerHosts1700000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'partner_hosts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'host', type: 'varchar', isUnique: true },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'access_token', type: 'varchar', isUnique: true },
          { name: 'is_uc_talent', type: 'boolean', default: false },
          { name: 'partner_id', type: 'uuid' },
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
      'partner_hosts',
      new TableForeignKey({
        columnNames: ['partner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partners',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'partner_hosts',
      new TableIndex({
        name: 'IDX_PARTNER_HOSTS_HOST',
        columnNames: ['host'],
      })
    );
    await queryRunner.createIndex(
      'partner_hosts',
      new TableIndex({
        name: 'IDX_PARTNER_HOSTS_SLUG',
        columnNames: ['slug'],
      })
    );
    await queryRunner.createIndex(
      'partner_hosts',
      new TableIndex({
        name: 'IDX_PARTNER_HOSTS_ACCESS_TOKEN',
        columnNames: ['access_token'],
      })
    );
    await queryRunner.createIndex(
      'partner_hosts',
      new TableIndex({
        name: 'IDX_PARTNER_HOSTS_PARTNER_ID',
        columnNames: ['partner_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('partner_hosts');
  }
}
```

### 3. Create PartnerHostNetworks Table

```typescript
// 1700000000021-CreatePartnerHostNetworks.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreatePartnerHostNetworks1700000000021
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'partner_host_networks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'network', type: 'varchar' },
          { name: 'default', type: 'boolean', default: false },
          { name: 'partner_host_id', type: 'uuid' },
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
      'partner_host_networks',
      new TableForeignKey({
        columnNames: ['partner_host_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partner_hosts',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'partner_host_networks',
      new TableIndex({
        name: 'IDX_PARTNER_HOST_NETWORKS_HOST_ID',
        columnNames: ['partner_host_id'],
      })
    );
    await queryRunner.createIndex(
      'partner_host_networks',
      new TableIndex({
        name: 'IDX_PARTNER_HOST_NETWORKS_NETWORK',
        columnNames: ['network'],
      })
    );
    await queryRunner.createIndex(
      'partner_host_networks',
      new TableIndex({
        name: 'IDX_PARTNER_HOST_NETWORKS_HOST_ID_NETWORK',
        columnNames: ['partner_host_id', 'network'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('partner_host_networks');
  }
}
```

## 🔧 Repositories

### 1. Partner Repository

```typescript
// partner.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class PartnerRepository extends BaseRepository<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>
  ) {
    super(partnerRepository);
  }

  async findBySlug(slug: string): Promise<Partner | null> {
    return this.partnerRepository.findOne({ where: { slug } });
  }

  async findByName(name: string): Promise<Partner | null> {
    return this.partnerRepository.findOne({ where: { name } });
  }

  async findUcTalentPartners(): Promise<Partner[]> {
    return this.partnerRepository.find({
      where: { isUcTalent: true },
      relations: ['partnerHosts'],
    });
  }

  async findWithStats(): Promise<Partner[]> {
    return this.partnerRepository
      .createQueryBuilder('partner')
      .leftJoinAndSelect('partner.partnerHosts', 'hosts')
      .addSelect('COUNT(DISTINCT hosts.id)', 'hostsCount')
      .addSelect('COUNT(DISTINCT networks.id)', 'networksCount')
      .addSelect('COUNT(DISTINCT jobs.id)', 'jobsCount')
      .leftJoin('hosts.networks', 'networks')
      .leftJoin('hosts.jobs', 'jobs')
      .groupBy('partner.id')
      .getMany();
  }
}
```

### 2. PartnerHost Repository

```typescript
// partner-host.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerHost } from './entities/partner-host.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class PartnerHostRepository extends BaseRepository<PartnerHost> {
  constructor(
    @InjectRepository(PartnerHost)
    private readonly partnerHostRepository: Repository<PartnerHost>
  ) {
    super(partnerHostRepository);
  }

  async findByHost(host: string): Promise<PartnerHost | null> {
    return this.partnerHostRepository.findOne({ where: { host } });
  }

  async findBySlug(slug: string): Promise<PartnerHost | null> {
    return this.partnerHostRepository.findOne({ where: { slug } });
  }

  async findByAccessToken(accessToken: string): Promise<PartnerHost | null> {
    return this.partnerHostRepository.findOne({
      where: { accessToken },
      relations: ['partner', 'networks'],
    });
  }

  async findByPartner(partnerId: string): Promise<PartnerHost[]> {
    return this.partnerHostRepository.find({
      where: { partnerId },
      relations: ['networks', 'jobs'],
    });
  }

  async findWithStats(): Promise<PartnerHost[]> {
    return this.partnerHostRepository
      .createQueryBuilder('host')
      .leftJoinAndSelect('host.partner', 'partner')
      .leftJoinAndSelect('host.networks', 'networks')
      .addSelect('COUNT(jobs.id)', 'jobsCount')
      .addSelect('COUNT(networks.id)', 'networksCount')
      .leftJoin('host.jobs', 'jobs')
      .groupBy('host.id')
      .addGroupBy('partner.id')
      .getMany();
  }

  async generateAccessToken(): Promise<string> {
    const crypto = require('crypto');
    return crypto.randomBytes(20).toString('hex');
  }
}
```

### 3. PartnerHostNetwork Repository

```typescript
// partner-host-network.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PartnerHostNetwork,
  NetworkType,
} from './entities/partner-host-network.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class PartnerHostNetworkRepository extends BaseRepository<PartnerHostNetwork> {
  constructor(
    @InjectRepository(PartnerHostNetwork)
    private readonly partnerHostNetworkRepository: Repository<PartnerHostNetwork>
  ) {
    super(partnerHostNetworkRepository);
  }

  async findByPartnerHost(
    partnerHostId: string
  ): Promise<PartnerHostNetwork[]> {
    return this.partnerHostNetworkRepository.find({
      where: { partnerHostId },
      order: { default: 'DESC', network: 'ASC' },
    });
  }

  async findByNetwork(
    partnerHostId: string,
    network: NetworkType
  ): Promise<PartnerHostNetwork | null> {
    return this.partnerHostNetworkRepository.findOne({
      where: { partnerHostId, network },
    });
  }

  async findDefaultNetwork(
    partnerHostId: string
  ): Promise<PartnerHostNetwork | null> {
    return this.partnerHostNetworkRepository.findOne({
      where: { partnerHostId, default: true },
    });
  }

  async setDefaultNetwork(
    partnerHostId: string,
    networkId: string
  ): Promise<void> {
    // First, unset all default networks for this partner host
    await this.partnerHostNetworkRepository.update(
      { partnerHostId },
      { default: false }
    );

    // Then set the specified network as default
    await this.partnerHostNetworkRepository.update(
      { id: networkId },
      { default: true }
    );
  }

  async getNetworkStats(): Promise<any> {
    return this.partnerHostNetworkRepository
      .createQueryBuilder('network')
      .select('network.network', 'network')
      .addSelect('COUNT(*)', 'count')
      .addSelect(
        'COUNT(CASE WHEN network.default = true THEN 1 END)',
        'defaultCount'
      )
      .groupBy('network.network')
      .getRawMany();
  }
}
```

## 🔐 Partner Authentication

### 1. Partner Token Guard

```typescript
// partner-token.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PartnerHostRepository } from '../repositories/partner-host.repository';

@Injectable()
export class PartnerTokenGuard implements CanActivate {
  constructor(private partnerHostRepository: PartnerHostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const host = this.extractHostFromHeader(request);

    if (!token || !host) {
      throw new UnauthorizedException('Partner token and host are required');
    }

    const partnerHost =
      await this.partnerHostRepository.findByAccessToken(token);

    if (!partnerHost || partnerHost.host !== host) {
      throw new UnauthorizedException('Invalid partner token or host');
    }

    request['partnerHost'] = partnerHost;
    request['partner'] = partnerHost.partner;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['x-partner-token'] as string;
  }

  private extractHostFromHeader(request: Request): string | undefined {
    return request.headers['x-partner-host'] as string;
  }
}
```

### 2. Partner Token Decorator

```typescript
// partner-token.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PartnerHost = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.partnerHost;
  }
);

export const Partner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.partner;
  }
);
```

## 📊 Partner Statistics Service

```typescript
// partner-statistics.service.ts
@Injectable()
export class PartnerStatisticsService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerHost)
    private partnerHostRepository: Repository<PartnerHost>,
    @InjectRepository(PartnerHostNetwork)
    private partnerHostNetworkRepository: Repository<PartnerHostNetwork>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>
  ) {}

  async getPartnerStats(partnerId: string) {
    const [hosts, networks, jobs] = await Promise.all([
      this.partnerHostRepository.findByPartner(partnerId),
      this.partnerHostNetworkRepository.findByPartnerHost(partnerId),
      this.jobRepository.find({ where: { partnerHost: { partnerId } } }),
    ]);

    const networkStats = this.calculateNetworkStats(networks);
    const jobStats = this.calculateJobStats(jobs);

    return {
      hosts: {
        total: hosts.length,
        active: hosts.filter((h) => h.isUcTalent).length,
        inactive: hosts.filter((h) => !h.isUcTalent).length,
      },
      networks: networkStats,
      jobs: jobStats,
      activity: await this.calculateActivityStats(partnerId),
    };
  }

  private calculateNetworkStats(networks: PartnerHostNetwork[]) {
    const stats = {
      total: networks.length,
      ethereum: 0,
      base: 0,
      bnb: 0,
      coti_v2: 0,
    };

    networks.forEach((network) => {
      stats[network.network]++;
    });

    return stats;
  }

  private calculateJobStats(jobs: Job[]) {
    return {
      total: jobs.length,
      active: jobs.filter((j) => j.status === 'active').length,
      closed: jobs.filter((j) => j.status === 'closed').length,
      expired: jobs.filter((j) => j.status === 'expired').length,
    };
  }

  private async calculateActivityStats(partnerId: string) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [jobsThisMonth, jobsLastMonth] = await Promise.all([
      this.jobRepository.count({
        where: {
          partnerHost: { partnerId },
          createdAt: MoreThanOrEqual(thisMonth),
        },
      }),
      this.jobRepository.count({
        where: {
          partnerHost: { partnerId },
          createdAt: MoreThanOrEqual(lastMonth),
          createdAt: LessThan(thisMonth),
        },
      }),
    ]);

    const growthRate =
      jobsLastMonth > 0
        ? ((jobsThisMonth - jobsLastMonth) / jobsLastMonth) * 100
        : 0;

    return {
      jobsThisMonth,
      jobsLastMonth,
      growthRate,
    };
  }
}
```

---

## 📋 Checklist

- [ ] Partner Entity
- [ ] PartnerHost Entity
- [ ] PartnerHostNetwork Entity
- [ ] Database Migrations
- [ ] Partner Repository
- [ ] PartnerHost Repository
- [ ] PartnerHostNetwork Repository
- [ ] Partner Token Guard
- [ ] Partner Token Decorator
- [ ] Partner Statistics Service
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
