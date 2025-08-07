import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCities1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create cities table
    await queryRunner.createTable(
      new Table({
        name: 'cities',
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
            name: 'nameAscii',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'countryId',
            type: 'uuid',
            isNullable: true,
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

    // Create foreign key
    await queryRunner.createForeignKey(
      'cities',
      new TableForeignKey({
        columnNames: ['countryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'cities',
      new TableIndex({
        name: 'IDX_CITIES_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'cities',
      new TableIndex({
        name: 'IDX_CITIES_COUNTRY_ID',
        columnNames: ['countryId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('cities', 'IDX_CITIES_COUNTRY_ID');
    await queryRunner.dropIndex('cities', 'IDX_CITIES_NAME');

    // Drop foreign key
    const table = await queryRunner.getTable('cities');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('countryId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('cities', foreignKey);
    }

    // Drop table
    await queryRunner.dropTable('cities');
  }
}
