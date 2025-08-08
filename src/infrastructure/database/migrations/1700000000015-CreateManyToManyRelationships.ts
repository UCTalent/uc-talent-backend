import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateManyToManyRelationships1700000000015 implements MigrationInterface {
  name = 'CreateManyToManyRelationships1700000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create talent_skills junction table
    await queryRunner.createTable(
      new Table({
        name: 'talent_skills',
        columns: [
          {
            name: 'talent_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'skill_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create talent_specialities junction table
    await queryRunner.createTable(
      new Table({
        name: 'talent_specialities',
        columns: [
          {
            name: 'talent_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'speciality_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create talent_roles junction table
    await queryRunner.createTable(
      new Table({
        name: 'talent_roles',
        columns: [
          {
            name: 'talent_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'role_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create job_skills junction table
    await queryRunner.createTable(
      new Table({
        name: 'job_skills',
        columns: [
          {
            name: 'job_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'skill_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign keys for talent_skills
    await queryRunner.createForeignKey(
      'talent_skills',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'talent_skills',
      new TableForeignKey({
        columnNames: ['skill_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'skills',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for talent_specialities
    await queryRunner.createForeignKey(
      'talent_specialities',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'talent_specialities',
      new TableForeignKey({
        columnNames: ['speciality_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'specialities',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for talent_roles
    await queryRunner.createForeignKey(
      'talent_roles',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'talent_roles',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for job_skills
    await queryRunner.createForeignKey(
      'job_skills',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'job_skills',
      new TableForeignKey({
        columnNames: ['skill_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'skills',
        onDelete: 'CASCADE',
      }),
    );

    // Create additional indexes for better performance
    await queryRunner.createIndex(
      'talents',
      new TableIndex({
        name: 'IDX_TALENTS_USER_ID',
        columnNames: ['user_id'],
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
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_ORGANIZATION_ID',
        columnNames: ['organization_id'],
      }),
    );

    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_JOBS_CREATED_BY',
        columnNames: ['created_by'],
      }),
    );

    await queryRunner.createIndex(
      'job_applies',
      new TableIndex({
        name: 'IDX_JOB_APPLIES_JOB_ID',
        columnNames: ['job_id'],
      }),
    );

    await queryRunner.createIndex(
      'job_applies',
      new TableIndex({
        name: 'IDX_JOB_APPLIES_TALENT_ID',
        columnNames: ['talent_id'],
      }),
    );

    await queryRunner.createIndex(
      'job_applies',
      new TableIndex({
        name: 'IDX_JOB_APPLIES_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'payment_distributions',
      new TableIndex({
        name: 'IDX_PAYMENT_DISTRIBUTIONS_JOB_ID',
        columnNames: ['job_id'],
      }),
    );

    await queryRunner.createIndex(
      'payment_distributions',
      new TableIndex({
        name: 'IDX_PAYMENT_DISTRIBUTIONS_RECIPIENT_ID',
        columnNames: ['recipient_id'],
      }),
    );

    await queryRunner.createIndex(
      'payment_distributions',
      new TableIndex({
        name: 'IDX_PAYMENT_DISTRIBUTIONS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'wallet_addresses',
      new TableIndex({
        name: 'IDX_WALLET_ADDRESSES_OWNER_ID',
        columnNames: ['owner_id'],
      }),
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_CITY_ID',
        columnNames: ['city_id'],
      }),
    );

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'IDX_ORGANIZATIONS_COUNTRY_ID',
        columnNames: ['country_id'],
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
    // Drop indexes
    await queryRunner.dropIndex('cities', 'IDX_CITIES_COUNTRY_ID');
    await queryRunner.dropIndex('organizations', 'IDX_ORGANIZATIONS_COUNTRY_ID');
    await queryRunner.dropIndex('organizations', 'IDX_ORGANIZATIONS_CITY_ID');
    await queryRunner.dropIndex('wallet_addresses', 'IDX_WALLET_ADDRESSES_OWNER_ID');
    await queryRunner.dropIndex('payment_distributions', 'IDX_PAYMENT_DISTRIBUTIONS_STATUS');
    await queryRunner.dropIndex('payment_distributions', 'IDX_PAYMENT_DISTRIBUTIONS_RECIPIENT_ID');
    await queryRunner.dropIndex('payment_distributions', 'IDX_PAYMENT_DISTRIBUTIONS_JOB_ID');
    await queryRunner.dropIndex('job_applies', 'IDX_JOB_APPLIES_STATUS');
    await queryRunner.dropIndex('job_applies', 'IDX_JOB_APPLIES_TALENT_ID');
    await queryRunner.dropIndex('job_applies', 'IDX_JOB_APPLIES_JOB_ID');
    await queryRunner.dropIndex('jobs', 'IDX_JOBS_CREATED_BY');
    await queryRunner.dropIndex('jobs', 'IDX_JOBS_ORGANIZATION_ID');
    await queryRunner.dropIndex('talents', 'IDX_TALENTS_STATUS');
    await queryRunner.dropIndex('talents', 'IDX_TALENTS_USER_ID');

    // Drop foreign keys for job_skills
    const jobSkillsTable = await queryRunner.getTable('job_skills');
    const jobSkillsForeignKeys = jobSkillsTable.foreignKeys;
    for (const foreignKey of jobSkillsForeignKeys) {
      await queryRunner.dropForeignKey('job_skills', foreignKey);
    }

    // Drop foreign keys for talent_roles
    const talentRolesTable = await queryRunner.getTable('talent_roles');
    const talentRolesForeignKeys = talentRolesTable.foreignKeys;
    for (const foreignKey of talentRolesForeignKeys) {
      await queryRunner.dropForeignKey('talent_roles', foreignKey);
    }

    // Drop foreign keys for talent_specialities
    const talentSpecialitiesTable = await queryRunner.getTable('talent_specialities');
    const talentSpecialitiesForeignKeys = talentSpecialitiesTable.foreignKeys;
    for (const foreignKey of talentSpecialitiesForeignKeys) {
      await queryRunner.dropForeignKey('talent_specialities', foreignKey);
    }

    // Drop foreign keys for talent_skills
    const talentSkillsTable = await queryRunner.getTable('talent_skills');
    const talentSkillsForeignKeys = talentSkillsTable.foreignKeys;
    for (const foreignKey of talentSkillsForeignKeys) {
      await queryRunner.dropForeignKey('talent_skills', foreignKey);
    }

    // Drop tables
    await queryRunner.dropTable('job_skills');
    await queryRunner.dropTable('talent_roles');
    await queryRunner.dropTable('talent_specialities');
    await queryRunner.dropTable('talent_skills');
  }
}
