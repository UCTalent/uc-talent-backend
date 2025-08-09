import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrganizations1700000000007 implements MigrationInterface {
  name = 'CreateOrganizations1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create industries table
    await queryRunner.createTable(
      new Table({
        name: 'industries',
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

    // Create organizations table
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
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contact_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contact_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'found_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'github',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'linkedin',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'twitter',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'org_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'size',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'logo_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'logo_filename',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'logo_content_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'logo_byte_size',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'logo_checksum',
            type: 'varchar',
            isNullable: true,
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
            name: 'industry_id',
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

    // Create indexes
    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_NAME',
        columnNames: ['name'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('organizations', 'IDX_ORGANIZATIONS_NAME');

    const table = await queryRunner.getTable('organizations');
    const foreignKeys = table.foreignKeys;

    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('organizations', foreignKey);
    }

    await queryRunner.dropTable('organizations');
    await queryRunner.dropTable('industries');
  }
}
