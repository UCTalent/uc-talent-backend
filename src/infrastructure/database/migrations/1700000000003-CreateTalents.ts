import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateTalents1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types first
    await queryRunner.query(`
      CREATE TYPE "public"."employment_status_enum" AS ENUM('available_now', 'open_to_opportunities', 'just_browsing')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."english_proficiency_enum" AS ENUM('basic', 'conversational', 'fluent', 'native')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."talent_status_enum" AS ENUM('new_profile', 'under_review', 'active', 'disabled')
    `);

    // Create talents table
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
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'employmentStatus',
            type: 'enum',
            enum: ['available_now', 'open_to_opportunities', 'just_browsing'],
            default: "'just_browsing'",
          },
          {
            name: 'englishProficiency',
            type: 'enum',
            enum: ['basic', 'conversational', 'fluent', 'native'],
            default: "'conversational'",
          },
          {
            name: 'experienceLevel',
            type: 'integer',
            default: 0,
          },
          {
            name: 'managementLevel',
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

    // Create foreign key for users table
    await queryRunner.createForeignKey(
      'talents',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_USER_ID',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_EMPLOYMENT_STATUS',
        columnNames: ['employmentStatus'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('talents', 'IDX_TALENTS_EMPLOYMENT_STATUS');
    await queryRunner.dropIndex('talents', 'IDX_TALENTS_STATUS');
    await queryRunner.dropIndex('talents', 'IDX_TALENTS_USER_ID');

    // Drop foreign keys
    const table = await queryRunner.getTable('talents');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
    await queryRunner.dropForeignKey('talents', foreignKey);

    // Drop table
    await queryRunner.dropTable('talents');

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."talent_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."english_proficiency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."employment_status_enum"`);
  }
}
