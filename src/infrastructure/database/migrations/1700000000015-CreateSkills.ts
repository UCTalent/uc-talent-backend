import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateSkills1700000000015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create skills table
    await queryRunner.createTable(
      new Table({
        name: 'skills',
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
            name: 'roleId',
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
      'skills',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'skills',
      new TableIndex({
        name: 'IDX_SKILLS_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'skills',
      new TableIndex({
        name: 'IDX_SKILLS_ROLE_ID',
        columnNames: ['roleId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('skills', 'IDX_SKILLS_ROLE_ID');
    await queryRunner.dropIndex('skills', 'IDX_SKILLS_NAME');

    // Drop foreign key
    const table = await queryRunner.getTable('skills');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('roleId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('skills', foreignKey);
    }

    // Drop table
    await queryRunner.dropTable('skills');
  }
}
