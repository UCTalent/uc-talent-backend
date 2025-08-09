import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

export class CreatePaymentEntities1700000000011 implements MigrationInterface {
  name = 'CreatePaymentEntities1700000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create wallet_addresses table
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
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'chain_name',
            type: 'varchar',
          },
          {
            name: 'owner_id',
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

    // Create payment_distributions table
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
          {
            name: 'amount_cents',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'amount_currency',
            type: 'varchar',
            default: "'USDT'",
          },
          {
            name: 'claimed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'payment_type',
            type: 'varchar',
          },
          {
            name: 'percentage',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'recipient_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'recipient_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'transaction_hash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'job_id',
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

    // Create foreign keys for wallet_addresses
    await queryRunner.createForeignKey(
      'wallet_addresses',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for payment_distributions
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for payment_distributions
    const paymentDistributionsTable = await queryRunner.getTable(
      'payment_distributions'
    );
    const paymentDistributionsForeignKeys =
      paymentDistributionsTable.foreignKeys;
    for (const foreignKey of paymentDistributionsForeignKeys) {
      await queryRunner.dropForeignKey('payment_distributions', foreignKey);
    }

    // Drop foreign keys for wallet_addresses
    const walletAddressesTable = await queryRunner.getTable('wallet_addresses');
    const walletAddressesForeignKey = walletAddressesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('owner_id') !== -1
    );
    if (walletAddressesForeignKey) {
      await queryRunner.dropForeignKey(
        'wallet_addresses',
        walletAddressesForeignKey
      );
    }

    // Drop tables
    await queryRunner.dropTable('payment_distributions');
    await queryRunner.dropTable('wallet_addresses');
  }
}
