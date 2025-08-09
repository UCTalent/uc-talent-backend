# Payment Domain Entities & Database Schema

## 📋 Tổng quan

Document này mô tả các entities và database schema cần thiết cho Payment domain trong NestJS.

## 🗄️ Database Entities

### 1. PaymentDistribution Entity

```typescript
// payment-distribution.entity.ts
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
import { User } from '@/modules/user/entities/user.entity';
import { Job } from '@/modules/job/entities/job.entity';

@Entity('payment_distributions')
export class PaymentDistribution extends BaseEntity {
  @Column({ name: 'amount_cents', type: 'bigint', default: 0 })
  amountCents: number;

  @Column({ name: 'amount_currency', default: 'USDT' })
  amountCurrency: string;

  @Column({ name: 'claimed_at', nullable: true })
  claimedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'payment_type' })
  paymentType: string; // referral_success, apply_success, close_no_hiring

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ name: 'recipient_type', nullable: true })
  recipientType: string;

  @Column({ name: 'recipient_id', nullable: true })
  recipientId: string;

  @Column()
  role: string; // candidate, referrer, hiring_manager, platform_fee

  @Column({ default: 'pending' })
  status: string; // pending, failed, completed

  @Column({ name: 'transaction_hash', nullable: true })
  transactionHash: string;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.paymentDistributions)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, (user) => user.paymentDistributions, {
    nullable: true,
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
```

### 2. WalletAddress Entity

```typescript
// wallet-address.entity.ts
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
import { User } from '@/modules/user/entities/user.entity';

@Entity('wallet_addresses')
export class WalletAddress extends BaseEntity {
  @Column()
  address: string;

  @Column({ name: 'chain_name' })
  chainName: string;

  // Foreign Keys
  @Column({ name: 'owner_id' })
  ownerId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.walletAddresses)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
```

### 3. Web3Event Entity

```typescript
// web3-event.entity.ts
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
import { Job } from '@/modules/job/entities/job.entity';

@Entity('web3_events')
export class Web3Event extends BaseEntity {
  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ type: 'jsonb' })
  data: any;

  // Foreign Keys
  @Column({ name: 'job_id' })
  jobId: string;

  // Relationships
  @ManyToOne(() => Job, (job) => job.web3Events)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
```

## 🗄️ Database Migrations

### 1. Create PaymentDistributions Table

```typescript
// 1700000000009-CreatePaymentDistributions.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentDistributions1700000000009
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_distributions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'amount_cents', type: 'bigint', default: 0 },
          { name: 'amount_currency', type: 'varchar', default: "'USDT'" },
          { name: 'claimed_at', type: 'timestamp', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'payment_type', type: 'varchar' },
          { name: 'percentage', type: 'decimal', precision: 5, scale: 2 },
          { name: 'recipient_type', type: 'varchar', isNullable: true },
          { name: 'recipient_id', type: 'uuid', isNullable: true },
          { name: 'role', type: 'varchar' },
          { name: 'status', type: 'varchar', default: "'pending'" },
          { name: 'transaction_hash', type: 'varchar', isNullable: true },
          { name: 'job_id', type: 'uuid' },
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
      'payment_distributions',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'payment_distributions',
      new TableForeignKey({
        columnNames: ['recipient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      })
    );

    await queryRunner.createIndex(
      'payment_distributions',
      new TableIndex({
        name: 'IDX_PAYMENT_DISTRIBUTIONS_JOB_ID',
        columnNames: ['job_id'],
      })
    );
    await queryRunner.createIndex(
      'payment_distributions',
      new TableIndex({
        name: 'IDX_PAYMENT_DISTRIBUTIONS_STATUS',
        columnNames: ['status'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_distributions');
  }
}
```

### 2. Create WalletAddresses Table

```typescript
// 1700000000010-CreateWalletAddresses.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateWalletAddresses1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wallet_addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'address', type: 'varchar' },
          { name: 'chain_name', type: 'varchar' },
          { name: 'owner_id', type: 'uuid' },
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
      'wallet_addresses',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'wallet_addresses',
      new TableIndex({
        name: 'IDX_WALLET_ADDRESSES_OWNER_ID',
        columnNames: ['owner_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallet_addresses');
  }
}
```

### 3. Create Web3Events Table

```typescript
// 1700000000011-CreateWeb3Events.ts
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateWeb3Events1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'web3_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'event_type', type: 'varchar' },
          { name: 'data', type: 'jsonb' },
          { name: 'job_id', type: 'uuid' },
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
      'web3_events',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createIndex(
      'web3_events',
      new TableIndex({
        name: 'IDX_WEB3_EVENTS_JOB_ID',
        columnNames: ['job_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('web3_events');
  }
}
```

## 🔧 Repositories

### 1. PaymentDistribution Repository

```typescript
// payment-distribution.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDistribution } from './entities/payment-distribution.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class PaymentDistributionRepository extends BaseRepository<PaymentDistribution> {
  constructor(
    @InjectRepository(PaymentDistribution)
    private readonly paymentDistributionRepository: Repository<PaymentDistribution>
  ) {
    super(paymentDistributionRepository);
  }

  async findClaimableByUser(
    jobId: string,
    userId: string
  ): Promise<PaymentDistribution[]> {
    return this.paymentDistributionRepository.find({
      where: {
        jobId,
        recipientId: userId,
        status: 'pending',
        role: Not('platform_fee'),
      },
    });
  }

  async findByJob(jobId: string): Promise<PaymentDistribution[]> {
    return this.paymentDistributionRepository.find({
      where: { jobId },
    });
  }
}
```

### 2. WalletAddress Repository

```typescript
// wallet-address.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletAddress } from './entities/wallet-address.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class WalletAddressRepository extends BaseRepository<WalletAddress> {
  constructor(
    @InjectRepository(WalletAddress)
    private readonly walletAddressRepository: Repository<WalletAddress>
  ) {
    super(walletAddressRepository);
  }

  async findByOwner(ownerId: string): Promise<WalletAddress[]> {
    return this.walletAddressRepository.find({
      where: { ownerId },
    });
  }
}
```

### 3. Web3Event Repository

```typescript
// web3-event.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Web3Event } from './entities/web3-event.entity';
import { BaseRepository } from '@/shared/common/base.repository';

@Injectable()
export class Web3EventRepository extends BaseRepository<Web3Event> {
  constructor(
    @InjectRepository(Web3Event)
    private readonly web3EventRepository: Repository<Web3Event>
  ) {
    super(web3EventRepository);
  }

  async findByJob(jobId: string): Promise<Web3Event[]> {
    return this.web3EventRepository.find({
      where: { jobId },
    });
  }
}
```

---

## 📋 Checklist

- [ ] PaymentDistribution Entity
- [ ] WalletAddress Entity
- [ ] Web3Event Entity
- [ ] Database Migrations
- [ ] PaymentDistribution Repository
- [ ] WalletAddress Repository
- [ ] Web3Event Repository
- [ ] Entity Tests
- [ ] Repository Tests

---

**🎉 Ready for implementation!**
