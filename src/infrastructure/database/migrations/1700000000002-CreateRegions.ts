import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRegions1700000000002 implements MigrationInterface {
  name = 'CreateRegions1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'regions',
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
            name: 'country_id',
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
      true,
    );

    await queryRunner.createForeignKey(
      'regions',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('regions');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('country_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('regions', foreignKey);
    }
    await queryRunner.dropTable('regions');
  }
}
