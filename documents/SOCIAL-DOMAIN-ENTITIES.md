# Social Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Social domain trong NestJS.

## 🗄️ Database Entities

### 1. SocialAccount Entity

```typescript
// social-account.entity.ts
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
import { User } from '@/modules/user/entities/user.entity';

export enum SocialProvider {
  FACEBOOK = 'facebook',
  X = 'x',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
}

export enum SocialAccountStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  DISCONNECTED = 'disconnected',
}

@Entity('social_accounts')
export class SocialAccount extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SocialProvider,
  })
  @Index()
  provider: SocialProvider;

  @Column()
  @Index()
  uid: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @Column({ name: 'last_synced_at', nullable: true })
  lastSyncedAt: Date;

  @Column({
    type: 'enum',
    enum: SocialAccountStatus,
    default: SocialAccountStatus.ACTIVE,
  })
  status: SocialAccountStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.socialAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### 2. SocialSetting Entity

```typescript
// social-setting.entity.ts
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
import { User } from '@/modules/user/entities/user.entity';

@Entity('social_settings')
export class SocialSetting extends BaseEntity {
  @Column({ name: 'show_linkedin_profile', default: true })
  showLinkedInProfile: boolean;

  @Column({ name: 'show_github_repos', default: true })
  showGitHubRepos: boolean;

  @Column({ name: 'show_social_connections', default: false })
  showSocialConnections: boolean;

  @Column({ name: 'allow_profile_sync', default: true })
  allowProfileSync: boolean;

  @Column({ name: 'public_social_links', type: 'jsonb', default: '[]' })
  publicSocialLinks: string[];

  @Column({ name: 'auto_sync', default: true })
  autoSync: boolean;

  @Column({ name: 'sync_frequency', default: 'daily' })
  syncFrequency: string; // daily, weekly, monthly

  @Column({
    name: 'sync_fields',
    type: 'jsonb',
    default: '["profile", "connections"]',
  })
  syncFields: string[];

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relationships
  @OneToOne(() => User, (user) => user.socialSetting)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
```

### 3. SocialSyncLog Entity

```typescript
// social-sync-log.entity.ts
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
import { SocialAccount } from './social-account.entity';

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

@Entity('social_sync_logs')
export class SocialSyncLog extends BaseEntity {
  @Column({
    type: 'enum',
    enum: SyncStatus,
  })
  @Index()
  status: SyncStatus;

  @Column({ name: 'sync_type' })
  syncType: string; // manual, auto, scheduled

  @Column({ name: 'changes_count', default: 0 })
  changesCount: number;

  @Column({ type: 'jsonb', nullable: true })
  changes: any[];

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'sync_duration_ms', nullable: true })
  syncDurationMs: number;

  // Foreign Keys
  @Column({ name: 'social_account_id' })
  socialAccountId: string;

  // Relationships
  @ManyToOne(() => SocialAccount, (socialAccount) => socialAccount.syncLogs)
  @JoinColumn({ name: 'social_account_id' })
  socialAccount: SocialAccount;
}
```

## 🗄️ Database Migrations

### 1. Create SocialAccounts Table

```typescript
// 1700000000022-CreateSocialAccounts.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateSocialAccounts1700000000022 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'social_accounts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'provider', type: 'varchar' },
          { name: 'uid', type: 'varchar' },
          { name: 'access_token', type: 'varchar', isNullable: true },
          { name: 'refresh_token', type: 'varchar', isNullable: true },
          { name: 'expires_at', type: 'timestamp', isNullable: true },
          { name: 'last_synced_at', type: 'timestamp', isNullable: true },
          { name: 'status', type: 'varchar', default: "'active'" },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'user_id', type: 'uuid' },
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
      'social_accounts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'social_accounts',
      new TableIndex({
        name: 'IDX_SOCIAL_ACCOUNTS_PROVIDER',
        columnNames: ['provider'],
      })
    );
    await queryRunner.createIndex(
      'social_accounts',
      new TableIndex({
        name: 'IDX_SOCIAL_ACCOUNTS_UID',
        columnNames: ['uid'],
      })
    );
    await queryRunner.createIndex(
      'social_accounts',
      new TableIndex({
        name: 'IDX_SOCIAL_ACCOUNTS_PROVIDER_UID',
        columnNames: ['provider', 'uid'],
        isUnique: true,
      })
    );
    await queryRunner.createIndex(
      'social_accounts',
      new TableIndex({
        name: 'IDX_SOCIAL_ACCOUNTS_USER_ID',
        columnNames: ['user_id'],
      })
    );
    await queryRunner.createIndex(
      'social_accounts',
      new TableIndex({
        name: 'IDX_SOCIAL_ACCOUNTS_USER_ID_PROVIDER',
        columnNames: ['user_id', 'provider'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('social_accounts');
  }
}
```

### 2. Create SocialSettings Table

```typescript
// 1700000000023-CreateSocialSettings.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateSocialSettings1700000000023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'social_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'show_linkedin_profile', type: 'boolean', default: true },
          { name: 'show_github_repos', type: 'boolean', default: true },
          { name: 'show_social_connections', type: 'boolean', default: false },
          { name: 'allow_profile_sync', type: 'boolean', default: true },
          { name: 'public_social_links', type: 'jsonb', default: "'[]'" },
          { name: 'auto_sync', type: 'boolean', default: true },
          { name: 'sync_frequency', type: 'varchar', default: "'daily'" },
          {
            name: 'sync_fields',
            type: 'jsonb',
            default: '\'["profile", "connections"]\'',
          },
          { name: 'user_id', type: 'uuid' },
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
      'social_settings',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'social_settings',
      new TableIndex({
        name: 'IDX_SOCIAL_SETTINGS_USER_ID',
        columnNames: ['user_id'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('social_settings');
  }
}
```

### 3. Create SocialSyncLogs Table

```typescript
// 1700000000024-CreateSocialSyncLogs.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateSocialSyncLogs1700000000024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'social_sync_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'status', type: 'varchar' },
          { name: 'sync_type', type: 'varchar' },
          { name: 'changes_count', type: 'integer', default: 0 },
          { name: 'changes', type: 'jsonb', isNullable: true },
          { name: 'error_message', type: 'text', isNullable: true },
          { name: 'sync_duration_ms', type: 'integer', isNullable: true },
          { name: 'social_account_id', type: 'uuid' },
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
      'social_sync_logs',
      new TableForeignKey({
        columnNames: ['social_account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'social_accounts',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'social_sync_logs',
      new TableIndex({
        name: 'IDX_SOCIAL_SYNC_LOGS_STATUS',
        columnNames: ['status'],
      })
    );
    await queryRunner.createIndex(
      'social_sync_logs',
      new TableIndex({
        name: 'IDX_SOCIAL_SYNC_LOGS_SOCIAL_ACCOUNT_ID',
        columnNames: ['social_account_id'],
      })
    );
    await queryRunner.createIndex(
      'social_sync_logs',
      new TableIndex({
        name: 'IDX_SOCIAL_SYNC_LOGS_CREATED_AT',
        columnNames: ['created_at'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('social_sync_logs');
  }
}
```

## 🔧 Repositories

### 1. SocialAccount Repository

```typescript
// social-account.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SocialAccount,
  SocialProvider,
} from './entities/social-account.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class SocialAccountRepository extends BaseRepository<SocialAccount> {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>
  ) {
    super(socialAccountRepository);
  }

  async findByProviderAndUid(
    provider: SocialProvider,
    uid: string
  ): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findOne({
      where: { provider, uid },
      relations: ['user'],
    });
  }

  async findByUserAndProvider(
    userId: string,
    provider: SocialProvider
  ): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findOne({
      where: { userId, provider },
    });
  }

  async findByUser(userId: string): Promise<SocialAccount[]> {
    return this.socialAccountRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUser(userId: string): Promise<SocialAccount[]> {
    return this.socialAccountRepository.find({
      where: { userId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiredTokens(): Promise<SocialAccount[]> {
    return this.socialAccountRepository
      .createQueryBuilder('social_account')
      .where('social_account.expiresAt < :now', { now: new Date() })
      .andWhere('social_account.refreshToken IS NOT NULL')
      .andWhere('social_account.status = :status', { status: 'active' })
      .getMany();
  }

  async findByProvider(provider: SocialProvider): Promise<SocialAccount[]> {
    return this.socialAccountRepository.find({
      where: { provider },
      relations: ['user'],
    });
  }

  async searchByMetadata(
    searchTerm: string,
    provider?: SocialProvider
  ): Promise<SocialAccount[]> {
    const queryBuilder = this.socialAccountRepository
      .createQueryBuilder('social_account')
      .leftJoinAndSelect('social_account.user', 'user')
      .where(
        `(
          social_account.metadata->>'displayName' ILIKE :search OR
          social_account.metadata->>'email' ILIKE :search OR
          social_account.metadata->>'headline' ILIKE :search OR
          social_account.metadata->>'bio' ILIKE :search
        )`,
        { search: `%${searchTerm}%` }
      );

    if (provider) {
      queryBuilder.andWhere('social_account.provider = :provider', {
        provider,
      });
    }

    return queryBuilder.getMany();
  }
}
```

### 2. SocialSetting Repository

```typescript
// social-setting.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialSetting } from './entities/social-setting.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class SocialSettingRepository extends BaseRepository<SocialSetting> {
  constructor(
    @InjectRepository(SocialSetting)
    private readonly socialSettingRepository: Repository<SocialSetting>
  ) {
    super(socialSettingRepository);
  }

  async findByUser(userId: string): Promise<SocialSetting | null> {
    return this.socialSettingRepository.findOne({
      where: { userId },
    });
  }

  async findOrCreateByUser(userId: string): Promise<SocialSetting> {
    let setting = await this.findByUser(userId);

    if (!setting) {
      setting = this.socialSettingRepository.create({
        userId,
        showLinkedInProfile: true,
        showGitHubRepos: true,
        showSocialConnections: false,
        allowProfileSync: true,
        publicSocialLinks: [],
        autoSync: true,
        syncFrequency: 'daily',
        syncFields: ['profile', 'connections'],
      });
      setting = await this.socialSettingRepository.save(setting);
    }

    return setting;
  }

  async findUsersWithAutoSync(): Promise<SocialSetting[]> {
    return this.socialSettingRepository.find({
      where: { autoSync: true },
      relations: ['user'],
    });
  }
}
```

### 3. SocialSyncLog Repository

```typescript
// social-sync-log.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialSyncLog, SyncStatus } from './entities/social-sync-log.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class SocialSyncLogRepository extends BaseRepository<SocialSyncLog> {
  constructor(
    @InjectRepository(SocialSyncLog)
    private readonly socialSyncLogRepository: Repository<SocialSyncLog>
  ) {
    super(socialSyncLogRepository);
  }

  async findBySocialAccount(
    socialAccountId: string,
    options?: { limit?: number }
  ): Promise<SocialSyncLog[]> {
    const { limit = 10 } = options || {};

    return this.socialSyncLogRepository.find({
      where: { socialAccountId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findRecentLogs(days: number = 7): Promise<SocialSyncLog[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    return this.socialSyncLogRepository
      .createQueryBuilder('sync_log')
      .leftJoinAndSelect('sync_log.socialAccount', 'social_account')
      .where('sync_log.createdAt >= :fromDate', { fromDate })
      .orderBy('sync_log.createdAt', 'DESC')
      .getMany();
  }

  async getSyncStats(socialAccountId?: string): Promise<any> {
    const queryBuilder = this.socialSyncLogRepository
      .createQueryBuilder('sync_log')
      .select('sync_log.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(sync_log.syncDurationMs)', 'avgDuration')
      .groupBy('sync_log.status');

    if (socialAccountId) {
      queryBuilder.where('sync_log.socialAccountId = :socialAccountId', {
        socialAccountId,
      });
    }

    return queryBuilder.getRawMany();
  }

  async logSync(data: {
    socialAccountId: string;
    status: SyncStatus;
    syncType: string;
    changesCount?: number;
    changes?: any[];
    errorMessage?: string;
    syncDurationMs?: number;
  }): Promise<SocialSyncLog> {
    const syncLog = this.socialSyncLogRepository.create(data);
    return this.socialSyncLogRepository.save(syncLog);
  }
}
```

## 🔌 OAuth Integration

### 1. OAuth Service Interface

```typescript
// oauth.service.interface.ts
export interface IOAuthService {
  exchangeCodeForToken(
    provider: string,
    code: string,
    redirectUri?: string
  ): Promise<any>;
  refreshToken(provider: string, refreshToken: string): Promise<any>;
  fetchProfileData(provider: string, accessToken: string): Promise<any>;
  revokeToken(provider: string, token: string): Promise<boolean>;
}
```

### 2. OAuth Service Implementation

```typescript
// oauth.service.ts
@Injectable()
export class OAuthService implements IOAuthService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async exchangeCodeForToken(
    provider: string,
    code: string,
    redirectUri?: string
  ): Promise<any> {
    switch (provider) {
      case 'linkedin':
        return this.linkedInExchangeCode(code, redirectUri);
      case 'github':
        return this.githubExchangeCode(code, redirectUri);
      case 'facebook':
        return this.facebookExchangeCode(code, redirectUri);
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }

  async refreshToken(provider: string, refreshToken: string): Promise<any> {
    switch (provider) {
      case 'linkedin':
        return this.linkedInRefreshToken(refreshToken);
      case 'github':
        return this.githubRefreshToken(refreshToken);
      case 'facebook':
        return this.facebookRefreshToken(refreshToken);
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }

  async fetchProfileData(provider: string, accessToken: string): Promise<any> {
    switch (provider) {
      case 'linkedin':
        return this.linkedInFetchProfile(accessToken);
      case 'github':
        return this.githubFetchProfile(accessToken);
      case 'facebook':
        return this.facebookFetchProfile(accessToken);
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }

  async revokeToken(provider: string, token: string): Promise<boolean> {
    switch (provider) {
      case 'linkedin':
        return this.linkedInRevokeToken(token);
      case 'github':
        return this.githubRevokeToken(token);
      case 'facebook':
        return this.facebookRevokeToken(token);
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }

  // LinkedIn implementation
  private async linkedInExchangeCode(
    code: string,
    redirectUri?: string
  ): Promise<any> {
    const response = await this.httpService
      .post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code,
        client_id: this.configService.get('LINKEDIN_CLIENT_ID'),
        client_secret: this.configService.get('LINKEDIN_CLIENT_SECRET'),
        redirect_uri: redirectUri,
      })
      .toPromise();

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000),
    };
  }

  private async linkedInFetchProfile(accessToken: string): Promise<any> {
    const [profile, email] = await Promise.all([
      this.httpService
        .get('https://api.linkedin.com/v2/people/~', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .toPromise(),
      this.httpService
        .get(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .toPromise(),
    ]);

    return {
      id: profile.data.id,
      email: email.data.elements[0]['handle~'].emailAddress,
      displayName: `${profile.data.localizedFirstName} ${profile.data.localizedLastName}`,
      firstName: profile.data.localizedFirstName,
      lastName: profile.data.localizedLastName,
      profileUrl: `https://linkedin.com/in/${profile.data.vanityName}`,
      pictureUrl:
        profile.data.profilePicture?.['displayImage~']?.elements[0]
          ?.identifiers[0]?.identifier,
    };
  }

  // GitHub implementation
  private async githubExchangeCode(
    code: string,
    redirectUri?: string
  ): Promise<any> {
    const response = await this.httpService
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get('GITHUB_CLIENT_ID'),
          client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
          code,
          redirect_uri: redirectUri,
        },
        {
          headers: { Accept: 'application/json' },
        }
      )
      .toPromise();

    return {
      accessToken: response.data.access_token,
      refreshToken: null, // GitHub doesn't provide refresh tokens
      expiresAt: null, // GitHub tokens don't expire
    };
  }

  private async githubFetchProfile(accessToken: string): Promise<any> {
    const response = await this.httpService
      .get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    return {
      id: response.data.id.toString(),
      email: response.data.email,
      displayName: response.data.name || response.data.login,
      firstName: response.data.name?.split(' ')[0],
      lastName: response.data.name?.split(' ')[1],
      profileUrl: response.data.html_url,
      avatarUrl: response.data.avatar_url,
      bio: response.data.bio,
      publicRepos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
    };
  }

  // Add similar implementations for Facebook and other providers...
}
```

---

## 📋 Checklist

- [ ] SocialAccount Entity
- [ ] SocialSetting Entity
- [ ] SocialSyncLog Entity
- [ ] Database Migrations
- [ ] SocialAccount Repository
- [ ] SocialSetting Repository
- [ ] SocialSyncLog Repository
- [ ] OAuth Service Interface
- [ ] OAuth Service Implementation
- [ ] Provider-specific OAuth methods
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
