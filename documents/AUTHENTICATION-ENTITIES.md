# Authentication Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho authentication system trong NestJS.

## 🗄️ Database Entities

### 1. User Entity

```typescript
// user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { Talent } from '@/modules/talent/entities/talent.entity';
import { WalletAddress } from '@/modules/payment/entities/wallet-address.entity';
import { PaymentDistribution } from '@/modules/payment/entities/payment-distribution.entity';
import { Note } from '@/modules/notification/entities/note.entity';
import { SocialAccount } from '@/modules/social/entities/social-account.entity';
import { City } from '@/modules/location/entities/city.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  phoneNumberCountry: string;

  @Column({ name: 'encrypted_password' })
  password: string;

  @Column({ name: 'firebase_uid', nullable: true, unique: true })
  @Index()
  firebaseUid: string;

  @Column({ name: 'firebase_provider', nullable: true })
  firebaseProvider: string;

  @Column({ type: 'jsonb', nullable: true })
  thirdwebMetadata: any;

  @Column({ type: 'text', array: true, default: [] })
  provider: string[];

  @Column({ type: 'text', array: true, default: [] })
  uid: string[];

  @Column({ name: 'ref_code', nullable: true })
  refCode: string;

  @Column({ name: 'location_city_id', nullable: true })
  locationCityId: string;

  @Column({ name: 'is_click_confirmed_form', default: false })
  isClickConfirmedForm: boolean;

  @Column({ name: 'confirmation_token', nullable: true, unique: true })
  confirmationToken: string;

  @Column({ name: 'confirmed_at', nullable: true })
  confirmedAt: Date;

  @Column({ name: 'reset_password_token', nullable: true, unique: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_sent_at', nullable: true })
  resetPasswordSentAt: Date;

  @Column({ name: 'sign_in_count', default: 0 })
  signInCount: number;

  @Column({ name: 'current_sign_in_at', nullable: true })
  currentSignInAt: Date;

  @Column({ name: 'last_sign_in_at', nullable: true })
  lastSignInAt: Date;

  @Column({ name: 'current_sign_in_ip', nullable: true })
  currentSignInIp: string;

  @Column({ name: 'last_sign_in_ip', nullable: true })
  lastSignInIp: string;

  @Column({ name: 'locked_at', nullable: true })
  lockedAt: Date;

  @Column({ name: 'unlock_token', nullable: true, unique: true })
  unlockToken: string;

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts: number;

  @Column({ name: 'remember_created_at', nullable: true })
  rememberCreatedAt: Date;

  @Column({ name: 'unconfirmed_email', nullable: true })
  unconfirmedEmail: string;

  // Relationships
  @OneToOne(() => Talent, (talent) => talent.user)
  talent: Talent;

  @OneToMany(() => WalletAddress, (walletAddress) => walletAddress.owner)
  walletAddresses: WalletAddress[];

  @OneToMany(
    () => PaymentDistribution,
    (paymentDistribution) => paymentDistribution.recipient
  )
  paymentDistributions: PaymentDistribution[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => SocialAccount, (socialAccount) => socialAccount.user)
  socialAccounts: SocialAccount[];

  @ManyToOne(() => City, (city) => city.users)
  locationCity: City;
}
```

### 2. Access Token Entity (OAuth2)

```typescript
// access-token.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('oauth_access_tokens')
export class AccessToken extends BaseEntity {
  @Column({ name: 'token', unique: true })
  @Index()
  token: string;

  @Column({ name: 'refresh_token', nullable: true, unique: true })
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'text', array: true, default: [] })
  scopes: string[];

  @Column({ name: 'revoked_at', nullable: true })
  revokedAt: Date;

  @Column({ name: 'resource_owner_id' })
  resourceOwnerId: string;

  @Column({ name: 'application_id', nullable: true })
  applicationId: string;

  @Column({ name: 'previous_refresh_token', nullable: true })
  previousRefreshToken: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.accessTokens)
  @JoinColumn({ name: 'resource_owner_id' })
  resourceOwner: User;
}
```

### 3. Refresh Token Entity

```typescript
// refresh-token.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('oauth_refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ name: 'token', unique: true })
  @Index()
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'revoked_at', nullable: true })
  revokedAt: Date;

  @Column({ name: 'resource_owner_id' })
  resourceOwnerId: string;

  @Column({ name: 'application_id', nullable: true })
  applicationId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'resource_owner_id' })
  resourceOwner: User;
}
```

### 4. Application Entity (OAuth2)

```typescript
// application.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';
import { AccessToken } from './access-token.entity';

@Entity('oauth_applications')
export class Application extends BaseEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'uid', unique: true })
  @Index()
  uid: string;

  @Column({ name: 'secret', nullable: true })
  secret: string;

  @Column({ name: 'redirect_uri' })
  redirectUri: string;

  @Column({ type: 'text', array: true, default: [] })
  scopes: string[];

  @Column({ name: 'confidential', default: true })
  confidential: boolean;

  // Relationships
  @OneToMany(() => AccessToken, (accessToken) => accessToken.application)
  accessTokens: AccessToken[];
}
```

### 5. JWT Deny List Entity

```typescript
// jwt-deny-list.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/common/base.entity';

@Entity('jwt_deny_list')
export class JwtDenyList extends BaseEntity {
  @Column({ name: 'jti', unique: true })
  @Index()
  jti: string;

  @Column({ name: 'exp' })
  exp: Date;
}
```

## 🗄️ Database Migrations

### 1. Create Users Table

```typescript
// 1700000000000-CreateUsers.ts
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsers1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number_country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'encrypted_password',
            type: 'varchar',
          },
          {
            name: 'firebase_uid',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'firebase_provider',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'thirdweb_metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'uid',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'ref_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location_city_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_click_confirmed_form',
            type: 'boolean',
            default: false,
          },
          {
            name: 'confirmation_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'reset_password_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'reset_password_sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'sign_in_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'current_sign_in_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_sign_in_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'current_sign_in_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_sign_in_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'locked_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unlock_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'failed_attempts',
            type: 'integer',
            default: 0,
          },
          {
            name: 'remember_created_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unconfirmed_email',
            type: 'varchar',
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

    // Create indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_FIREBASE_UID',
        columnNames: ['firebase_uid'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_CONFIRMATION_TOKEN',
        columnNames: ['confirmation_token'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_RESET_PASSWORD_TOKEN',
        columnNames: ['reset_password_token'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### 2. Create OAuth2 Tables

```typescript
// 1700000000001-CreateOAuthTables.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateOAuthTables1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create oauth_applications table
    await queryRunner.createTable(
      new Table({
        name: 'oauth_applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'uid',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'redirect_uri',
            type: 'text',
          },
          {
            name: 'scopes',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'confidential',
            type: 'boolean',
            default: true,
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

    // Create oauth_access_tokens table
    await queryRunner.createTable(
      new Table({
        name: 'oauth_access_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'scopes',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'revoked_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resource_owner_id',
            type: 'uuid',
          },
          {
            name: 'application_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'previous_refresh_token',
            type: 'varchar',
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

    // Create oauth_refresh_tokens table
    await queryRunner.createTable(
      new Table({
        name: 'oauth_refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'token',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'revoked_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resource_owner_id',
            type: 'uuid',
          },
          {
            name: 'application_id',
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

    // Create jwt_deny_list table
    await queryRunner.createTable(
      new Table({
        name: 'jwt_deny_list',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'jti',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'exp',
            type: 'timestamp',
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
      'oauth_access_tokens',
      new TableForeignKey({
        columnNames: ['resource_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'oauth_refresh_tokens',
      new TableForeignKey({
        columnNames: ['resource_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.createIndex(
      'oauth_access_tokens',
      new TableIndex({
        name: 'IDX_OAUTH_ACCESS_TOKENS_TOKEN',
        columnNames: ['token'],
      })
    );

    await queryRunner.createIndex(
      'oauth_refresh_tokens',
      new TableIndex({
        name: 'IDX_OAUTH_REFRESH_TOKENS_TOKEN',
        columnNames: ['token'],
      })
    );

    await queryRunner.createIndex(
      'jwt_deny_list',
      new TableIndex({
        name: 'IDX_JWT_DENY_LIST_JTI',
        columnNames: ['jti'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jwt_deny_list');
    await queryRunner.dropTable('oauth_refresh_tokens');
    await queryRunner.dropTable('oauth_access_tokens');
    await queryRunner.dropTable('oauth_applications');
  }
}
```

## 🔧 Repositories

### 1. User Repository

```typescript
// user.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { firebaseUid } });
  }

  async findByConfirmationToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { confirmationToken: token } });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async updateConfirmationToken(userId: string, token: string): Promise<void> {
    await this.userRepository.update(userId, { confirmationToken: token });
  }

  async updateResetPasswordToken(userId: string, token: string): Promise<void> {
    await this.userRepository.update(userId, {
      resetPasswordToken: token,
      resetPasswordSentAt: new Date(),
    });
  }

  async confirmUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      confirmedAt: new Date(),
      confirmationToken: null,
    });
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    await this.userRepository.update(userId, {
      password,
      resetPasswordToken: null,
      resetPasswordSentAt: null,
    });
  }

  async incrementSignInCount(userId: string, ip: string): Promise<void> {
    await this.userRepository.update(userId, {
      signInCount: () => 'sign_in_count + 1',
      lastSignInAt: new Date(),
      lastSignInIp: ip,
      currentSignInAt: new Date(),
      currentSignInIp: ip,
    });
  }

  async lockUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lockedAt: new Date(),
      unlockToken: this.generateUnlockToken(),
    });
  }

  async unlockUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lockedAt: null,
      unlockToken: null,
      failedAttempts: 0,
    });
  }

  private generateUnlockToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
```

### 2. Access Token Repository

```typescript
// access-token.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from './entities/access-token.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class AccessTokenRepository extends BaseRepository<AccessToken> {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>
  ) {
    super(accessTokenRepository);
  }

  async findByToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({
      where: { token },
      relations: ['resourceOwner'],
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({
      where: { refreshToken },
      relations: ['resourceOwner'],
    });
  }

  async findValidByUserId(userId: string): Promise<AccessToken[]> {
    return this.accessTokenRepository.find({
      where: {
        resourceOwnerId: userId,
        revokedAt: null,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async revokeToken(token: string): Promise<void> {
    await this.accessTokenRepository.update(
      { token },
      { revokedAt: new Date() }
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.accessTokenRepository.update(
      { resourceOwnerId: userId },
      { revokedAt: new Date() }
    );
  }

  async createToken(data: {
    token: string;
    refreshToken?: string;
    expiresAt: Date;
    scopes: string[];
    resourceOwnerId: string;
    applicationId?: string;
  }): Promise<AccessToken> {
    const accessToken = this.accessTokenRepository.create(data);
    return this.accessTokenRepository.save(accessToken);
  }
}
```

### 3. JWT Deny List Repository

```typescript
// jwt-deny-list.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtDenyList } from './entities/jwt-deny-list.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class JwtDenyListRepository extends BaseRepository<JwtDenyList> {
  constructor(
    @InjectRepository(JwtDenyList)
    private readonly jwtDenyListRepository: Repository<JwtDenyList>
  ) {
    super(jwtDenyListRepository);
  }

  async addToDenyList(jti: string, exp: Date): Promise<JwtDenyList> {
    const denyListEntry = this.jwtDenyListRepository.create({ jti, exp });
    return this.jwtDenyListRepository.save(denyListEntry);
  }

  async isDenied(jti: string): Promise<boolean> {
    const entry = await this.jwtDenyListRepository.findOne({ where: { jti } });
    return !!entry;
  }

  async cleanupExpired(): Promise<void> {
    await this.jwtDenyListRepository.delete({
      exp: LessThan(new Date()),
    });
  }
}
```

## 🔧 Services

### 1. User Service

```typescript
// user.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { BaseService } from '@/shared/common/base.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findByFirebaseUid(firebaseUid);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate confirmation token
    const confirmationToken = this.generateConfirmationToken();

    const user = await this.userRepository.create({
      ...createUserDto,
      confirmationToken,
      confirmedAt: null,
    });

    return user;
  }

  async confirmEmail(token: string): Promise<User> {
    const user = await this.userRepository.findByConfirmationToken(token);
    if (!user) {
      throw new NotFoundException('Invalid confirmation token');
    }

    if (user.confirmedAt) {
      throw new ConflictException('Email already confirmed');
    }

    await this.userRepository.confirmUser(user.id);
    return this.findById(user.id);
  }

  async resetPassword(token: string, password: string): Promise<User> {
    const user = await this.userRepository.findByResetPasswordToken(token);
    if (!user) {
      throw new NotFoundException('Invalid reset password token');
    }

    const hashedPassword = await this.hashPassword(password);
    await this.userRepository.resetPassword(user.id, hashedPassword);

    return this.findById(user.id);
  }

  async updateSignInInfo(userId: string, ip: string): Promise<void> {
    await this.userRepository.incrementSignInCount(userId, ip);
  }

  async handleFailedLogin(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    const newFailedAttempts = user.failedAttempts + 1;

    if (newFailedAttempts >= 5) {
      await this.userRepository.lockUser(userId);
    } else {
      await this.userRepository.update(userId, {
        failedAttempts: newFailedAttempts,
      });
    }
  }

  private generateConfirmationToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
```

## 🧪 Testing

### 1. User Entity Test

```typescript
// user.entity.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

describe('User Entity', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    };

    const user = new User();
    Object.assign(user, userData);

    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    const result = await service.create(userData);

    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });
});
```

---

## 📋 Checklist

- [ ] User Entity
- [ ] Access Token Entity
- [ ] Refresh Token Entity
- [ ] Application Entity
- [ ] JWT Deny List Entity
- [ ] Database Migrations
- [ ] User Repository
- [ ] Access Token Repository
- [ ] JWT Deny List Repository
- [ ] User Service
- [ ] Entity Tests
- [ ] Repository Tests
- [ ] Service Tests

---

**🎉 Ready for implementation!**
