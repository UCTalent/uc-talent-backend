import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTalents1700000000005 implements MigrationInterface {
  name = 'CreateTalents1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."employment_status_enum" AS ENUM('available_now', 'open_to_opportunities', 'just_browsing')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."english_proficiency_enum" AS ENUM('basic', 'conversational', 'fluent', 'native')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."talent_status_enum" AS ENUM('new_profile', 'under_review', 'active', 'disabled')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'talents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'employment_status',
            type: 'enum',
            enum: ['available_now', 'open_to_opportunities', 'just_browsing'],
            default: "'just_browsing'",
          },
          {
            name: 'english_proficiency',
            type: 'enum',
            enum: ['basic', 'conversational', 'fluent', 'native'],
            default: "'conversational'",
          },
          {
            name: 'experience_level',
            type: 'integer',
            default: 0,
          },
          {
            name: 'management_level',
            type: 'integer',
            default: 0,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['new_profile', 'under_review', 'active', 'disabled'],
            default: "'new_profile'",
          },
          {
            name: 'step',
            type: 'integer',
            default: 0,
          },
          {
            name: 'headline',
            type: 'varchar',
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
      'talents',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('talents');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('talents', foreignKey);
    }

    await queryRunner.dropTable('talents');
    await queryRunner.query(`DROP TYPE "public"."talent_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."english_proficiency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."employment_status_enum"`);
  }
}
