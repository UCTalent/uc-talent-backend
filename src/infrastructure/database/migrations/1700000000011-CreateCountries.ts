import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCountries1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create countries table
    await queryRunner.createTable(
      new Table({
        name: 'countries',
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
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'countries',
      new TableIndex({
        name: 'IDX_COUNTRIES_CODE',
        columnNames: ['code'],
      }),
    );

    await queryRunner.createIndex(
      'countries',
      new TableIndex({
        name: 'IDX_COUNTRIES_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('countries', 'IDX_COUNTRIES_NAME');
    await queryRunner.dropIndex('countries', 'IDX_COUNTRIES_CODE');

    // Drop table
    await queryRunner.dropTable('countries');
  }
}
