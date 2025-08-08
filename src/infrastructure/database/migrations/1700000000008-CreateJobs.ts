import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateJobs1700000000008 implements MigrationInterface {
  name = 'CreateJobs1700000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."job_status_enum" AS ENUM('pending_to_review', 'published', 'closed', 'expired')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."location_type_enum" AS ENUM('remote', 'on_site', 'hybrid')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_number',
            type: 'bigint',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'about',
            type: 'text',
            isNullable: true,
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
            name: 'job_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'responsibilities',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'minimum_qualifications',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'preferred_requirement',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'direct_manager',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'direct_manager_title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'direct_manager_profile',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'direct_manager_logo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location_type',
            type: 'enum',
            enum: ['remote', 'on_site', 'hybrid'],
            default: "'on_site'",
          },
          {
            name: 'location_value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'salary_from_cents',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'salary_from_currency',
            type: 'varchar',
            default: "'USD'",
          },
          {
            name: 'salary_to_cents',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'salary_to_currency',
            type: 'varchar',
            default: "'USD'",
          },
          {
            name: 'salary_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'referral_cents',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'referral_currency',
            type: 'varchar',
            default: "'USD'",
          },
          {
            name: 'referral_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'referral_info',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'apply_method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'apply_target',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'english_level',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending_to_review', 'published', 'closed', 'expired'],
            default: "'pending_to_review'",
          },
          {
            name: 'priority',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'source',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'network',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'posted_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'expired_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'address_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'chain_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'speciality_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'city_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'country_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'region_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'global_region_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'partner_host_id',
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

    // Create foreign keys
    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['organization_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'organizations',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['speciality_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialities',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['region_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'regions',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_JOB_NUMBER',
        columnNames: ['job_number'],
      }),
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_STATUS',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('jobs', 'IDX_JOBS_STATUS');
    await queryRunner.dropIndex('jobs', 'IDX_JOBS_JOB_NUMBER');

    const table = await queryRunner.getTable('jobs');
    const foreignKeys = table.foreignKeys;
    
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('jobs', foreignKey);
    }

    await queryRunner.dropTable('jobs');
    await queryRunner.query(`DROP TYPE "public"."location_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."job_status_enum"`);
  }
}
