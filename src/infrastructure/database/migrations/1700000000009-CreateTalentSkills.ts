import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateExperiences1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create job_type enum
    await queryRunner.query(`
      CREATE TYPE "public"."job_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'freelance', 'internship')
    `);

    // Create experiences table
    await queryRunner.createTable(
      new Table({
        name: 'experiences',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'companyName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'jobType',
            type: 'enum',
            enum: ['full_time', 'part_time', 'contract', 'freelance', 'internship'],
          },
          {
            name: 'isCurrentlyWorking',
            type: 'boolean',
            default: false,
          },
          {
            name: 'startTime',
            type: 'timestamp',
          },
          {
            name: 'endTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'jobDescription',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'talentId',
            type: 'uuid',
          },
          {
            name: 'organizationId',
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

    // Create foreign keys
    await queryRunner.createForeignKey(
      'experiences',
      new TableForeignKey({
        columnNames: ['talentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'experiences',
      new TableIndex({
        name: 'IDX_EXPERIENCES_TALENT_ID',
        columnNames: ['talentId'],
      }),
    );

    await queryRunner.createIndex(
      'experiences',
      new TableIndex({
        name: 'IDX_EXPERIENCES_START_TIME',
        columnNames: ['startTime'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('experiences', 'IDX_EXPERIENCES_START_TIME');
    await queryRunner.dropIndex('experiences', 'IDX_EXPERIENCES_TALENT_ID');

    // Drop foreign keys
    const table = await queryRunner.getTable('experiences');
    const foreignKeys = table.foreignKeys;
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('experiences', foreignKey);
    }

    // Drop table
    await queryRunner.dropTable('experiences');

    // Drop enum type
    await queryRunner.query(`DROP TYPE "public"."job_type_enum"`);
  }
}
