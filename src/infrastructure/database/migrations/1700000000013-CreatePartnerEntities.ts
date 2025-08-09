import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePartnerEntities1700000000013 implements MigrationInterface {
  name = 'CreatePartnerEntities1700000000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create partners table
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
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'is_uc_talent',
            type: 'boolean',
            default: false,
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

    // Create partner_hosts table
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
          {
            name: 'partner_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'domain',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'api_key',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
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

    // Create partner_host_networks table
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
          {
            name: 'partner_host_id',
            type: 'uuid',
          },
          {
            name: 'network_name',
            type: 'varchar',
          },
          {
            name: 'network_config',
            type: 'jsonb',
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

    // Create indexes for partners
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

    // Create foreign keys for partner_hosts
    await queryRunner.createForeignKey(
      'partner_hosts',
      new TableForeignKey({
        columnNames: ['partner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partners',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for partner_host_networks
    await queryRunner.createForeignKey(
      'partner_host_networks',
      new TableForeignKey({
        columnNames: ['partner_host_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'partner_hosts',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes for partners
    await queryRunner.dropIndex('partners', 'IDX_PARTNERS_SLUG');
    await queryRunner.dropIndex('partners', 'IDX_PARTNERS_NAME');

    // Drop foreign keys for partner_host_networks
    const partnerHostNetworksTable = await queryRunner.getTable(
      'partner_host_networks'
    );
    const partnerHostNetworksForeignKey =
      partnerHostNetworksTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('partner_host_id') !== -1
      );
    if (partnerHostNetworksForeignKey) {
      await queryRunner.dropForeignKey(
        'partner_host_networks',
        partnerHostNetworksForeignKey
      );
    }

    // Drop foreign keys for partner_hosts
    const partnerHostsTable = await queryRunner.getTable('partner_hosts');
    const partnerHostsForeignKey = partnerHostsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('partner_id') !== -1
    );
    if (partnerHostsForeignKey) {
      await queryRunner.dropForeignKey('partner_hosts', partnerHostsForeignKey);
    }

    // Drop tables
    await queryRunner.dropTable('partner_host_networks');
    await queryRunner.dropTable('partner_hosts');
    await queryRunner.dropTable('partners');
  }
}
