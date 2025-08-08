import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateJobRelatedEntities1700000000009 implements MigrationInterface {
  name = 'CreateJobRelatedEntities1700000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."job_apply_status_enum" AS ENUM('new', 'email_sent', 'under_review', 'interviewing', 'offering', 'hired', 'rejected')
    `);

    // Create job_applies table
    await queryRunner.createTable(
      new Table({
        name: 'job_applies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'talent_id',
            type: 'uuid',
          },
          {
            name: 'uploaded_resume_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['new', 'email_sent', 'under_review', 'interviewing', 'offering', 'hired', 'rejected'],
            default: "'new'",
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'job_referral_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'signature',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'personal_sign',
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

    // Create job_referrals table
    await queryRunner.createTable(
      new Table({
        name: 'job_referrals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'referrer_id',
            type: 'uuid',
          },
          {
            name: 'referred_email',
            type: 'varchar',
          },
          {
            name: 'referred_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
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

    // Create job_closure_reasons table
    await queryRunner.createTable(
      new Table({
        name: 'job_closure_reasons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'reason',
            type: 'varchar',
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

    // Create choice_options table
    await queryRunner.createTable(
      new Table({
        name: 'choice_options',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'question',
            type: 'varchar',
          },
          {
            name: 'options',
            type: 'jsonb',
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

    // Create referral_links table
    await queryRunner.createTable(
      new Table({
        name: 'referral_links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
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

    // Create web3_events table
    await queryRunner.createTable(
      new Table({
        name: 'web3_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'job_id',
            type: 'uuid',
          },
          {
            name: 'event_type',
            type: 'varchar',
          },
          {
            name: 'event_data',
            type: 'jsonb',
          },
          {
            name: 'transaction_hash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'block_number',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'chain_id',
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

    // Create foreign keys for job_applies
    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['talent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'talents',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'job_applies',
      new TableForeignKey({
        columnNames: ['job_referral_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'job_referrals',
        onDelete: 'SET NULL',
      }),
    );

    // Create foreign keys for job_referrals
    await queryRunner.createForeignKey(
      'job_referrals',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'job_referrals',
      new TableForeignKey({
        columnNames: ['referrer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for job_closure_reasons
    await queryRunner.createForeignKey(
      'job_closure_reasons',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for choice_options
    await queryRunner.createForeignKey(
      'choice_options',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for referral_links
    await queryRunner.createForeignKey(
      'referral_links',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign keys for web3_events
    await queryRunner.createForeignKey(
      'web3_events',
      new TableForeignKey({
        columnNames: ['job_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for web3_events
    const web3EventsTable = await queryRunner.getTable('web3_events');
    const web3EventsForeignKey = web3EventsTable.foreignKeys.find(fk => fk.columnNames.indexOf('job_id') !== -1);
    if (web3EventsForeignKey) {
      await queryRunner.dropForeignKey('web3_events', web3EventsForeignKey);
    }

    // Drop foreign keys for referral_links
    const referralLinksTable = await queryRunner.getTable('referral_links');
    const referralLinksForeignKey = referralLinksTable.foreignKeys.find(fk => fk.columnNames.indexOf('job_id') !== -1);
    if (referralLinksForeignKey) {
      await queryRunner.dropForeignKey('referral_links', referralLinksForeignKey);
    }

    // Drop foreign keys for choice_options
    const choiceOptionsTable = await queryRunner.getTable('choice_options');
    const choiceOptionsForeignKey = choiceOptionsTable.foreignKeys.find(fk => fk.columnNames.indexOf('job_id') !== -1);
    if (choiceOptionsForeignKey) {
      await queryRunner.dropForeignKey('choice_options', choiceOptionsForeignKey);
    }

    // Drop foreign keys for job_closure_reasons
    const jobClosureReasonsTable = await queryRunner.getTable('job_closure_reasons');
    const jobClosureReasonsForeignKey = jobClosureReasonsTable.foreignKeys.find(fk => fk.columnNames.indexOf('job_id') !== -1);
    if (jobClosureReasonsForeignKey) {
      await queryRunner.dropForeignKey('job_closure_reasons', jobClosureReasonsForeignKey);
    }

    // Drop foreign keys for job_referrals
    const jobReferralsTable = await queryRunner.getTable('job_referrals');
    const jobReferralsForeignKeys = jobReferralsTable.foreignKeys;
    for (const foreignKey of jobReferralsForeignKeys) {
      await queryRunner.dropForeignKey('job_referrals', foreignKey);
    }

    // Drop foreign keys for job_applies
    const jobAppliesTable = await queryRunner.getTable('job_applies');
    const jobAppliesForeignKeys = jobAppliesTable.foreignKeys;
    for (const foreignKey of jobAppliesForeignKeys) {
      await queryRunner.dropForeignKey('job_applies', foreignKey);
    }

    // Drop tables
    await queryRunner.dropTable('web3_events');
    await queryRunner.dropTable('referral_links');
    await queryRunner.dropTable('choice_options');
    await queryRunner.dropTable('job_closure_reasons');
    await queryRunner.dropTable('job_referrals');
    await queryRunner.dropTable('job_applies');

    await queryRunner.query(`DROP TYPE "public"."job_apply_status_enum"`);
  }
}
