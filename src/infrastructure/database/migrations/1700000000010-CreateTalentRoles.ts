import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateTalentRoles1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'talent_roles',
        columns: [
          { name: 'talentId', type: 'uuid', isPrimary: true },
          { name: 'roleId', type: 'uuid', isPrimary: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey('talent_roles', new TableForeignKey({
      columnNames: ['talentId'], referencedColumnNames: ['id'], referencedTableName: 'talents', onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('talent_roles', new TableForeignKey({
      columnNames: ['roleId'], referencedColumnNames: ['id'], referencedTableName: 'roles', onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('talent_roles');
  }
}
