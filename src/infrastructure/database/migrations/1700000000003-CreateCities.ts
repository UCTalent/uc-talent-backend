import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCities1700000000003 implements MigrationInterface {
  name = 'CreateCities1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'name_ascii',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'country_id',
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
      true,
    );

    await queryRunner.createForeignKey(
      'cities',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      }),
    );

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
        columnNames: ['country_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('cities', 'IDX_CITIES_COUNTRY_ID');
    await queryRunner.dropIndex('cities', 'IDX_CITIES_NAME');

    const table = await queryRunner.getTable('cities');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('country_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('cities', foreignKey);
    }

    await queryRunner.dropTable('cities');
  }
}
