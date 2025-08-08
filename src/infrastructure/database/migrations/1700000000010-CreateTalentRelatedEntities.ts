import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTalentRelatedEntities1700000000010
  implements MigrationInterface
{
  name = 'CreateTalentRelatedEntities1700000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'company',
            type: 'varchar',
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'current',
            type: 'boolean',
            default: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'job_type',
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

    // Create educations table
    await queryRunner.createTable(
      new Table({
        name: 'educations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'school',
            type: 'varchar',
          },
          {
            name: 'degree',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'field_of_study',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'current',
            type: 'boolean',
            default: false,
          },
          {
            name: 'description',
            type: 'text',
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

    // Create external_links table
    await queryRunner.createTable(
      new Table({
        name: 'external_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'url',
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
      true,
    );

    // Create uploaded_resumes table
    await queryRunner.createTable(
      new Table({
        name: 'uploaded_resumes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'content_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'byte_size',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'checksum',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'url',
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

    // Create recommendation_jobs table
    await queryRunner.createTable(
      new Table({
        name: 'recommendation_jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'score',
            type: 'decimal',
            precision: 5,
            scale: 2,
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

    // Create foreign keys for experiences
    await queryRunner.createForeignKey(
      'experiences',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for educations
    await queryRunner.createForeignKey(
      'educations',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for external_links
    await queryRunner.createForeignKey(
      'external_links',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for uploaded_resumes
    await queryRunner.createForeignKey(
      'uploaded_resumes',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for recommendation_jobs
    await queryRunner.createForeignKey(
      'recommendation_jobs',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'recommendation_jobs',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for recommendation_jobs
    const recommendationJobsTable = await queryRunner.getTable(
      'recommendation_jobs',
    );
    const recommendationJobsForeignKeys = recommendationJobsTable.foreignKeys;
    for (const foreignKey of recommendationJobsForeignKeys) {
      await queryRunner.dropForeignKey('recommendation_jobs', foreignKey);
    }

    // Drop foreign keys for uploaded_resumes
    const uploadedResumesTable = await queryRunner.getTable('uploaded_resumes');
    const uploadedResumesForeignKey = uploadedResumesTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('talent_id') !== -1,
    );
    if (uploadedResumesForeignKey) {
      await queryRunner.dropForeignKey(
        'uploaded_resumes',
        uploadedResumesForeignKey,
      );
    }

    // Drop foreign keys for external_links
    const externalLinksTable = await queryRunner.getTable('external_links');
    const externalLinksForeignKey = externalLinksTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('talent_id') !== -1,
    );
    if (externalLinksForeignKey) {
      await queryRunner.dropForeignKey(
        'external_links',
        externalLinksForeignKey,
      );
    }

    // Drop foreign keys for educations
    const educationsTable = await queryRunner.getTable('educations');
    const educationsForeignKey = educationsTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('talent_id') !== -1,
    );
    if (educationsForeignKey) {
      await queryRunner.dropForeignKey('educations', educationsForeignKey);
    }

    // Drop foreign keys for experiences
    const experiencesTable = await queryRunner.getTable('experiences');
    const experiencesForeignKey = experiencesTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('talent_id') !== -1,
    );
    if (experiencesForeignKey) {
      await queryRunner.dropForeignKey('experiences', experiencesForeignKey);
    }

    // Drop tables
    await queryRunner.dropTable('recommendation_jobs');
    await queryRunner.dropTable('uploaded_resumes');
    await queryRunner.dropTable('external_links');
    await queryRunner.dropTable('educations');
    await queryRunner.dropTable('experiences');
  }
}
