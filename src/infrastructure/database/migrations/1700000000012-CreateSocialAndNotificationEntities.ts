import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

export class CreateSocialAndNotificationEntities1700000000012
  implements MigrationInterface
{
  name = 'CreateSocialAndNotificationEntities1700000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create notes table
    await queryRunner.createTable(
      new Table({
        name: 'notes',
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
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
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
      true
    );

    // Create social_accounts table
    await queryRunner.createTable(
      new Table({
        name: 'social_accounts',
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
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'uid',
            type: 'varchar',
          },
          {
            name: 'access_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
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
      true
    );

    // Create social_settings table
    await queryRunner.createTable(
      new Table({
        name: 'social_settings',
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
            name: 'setting_key',
            type: 'varchar',
          },
          {
            name: 'setting_value',
            type: 'text',
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
      true
    );

    // Create external_links table (social domain)
    await queryRunner.createTable(
      new Table({
        name: 'social_external_links',
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
            name: 'platform',
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
      true
    );

    // Create foreign keys for notes
    await queryRunner.createForeignKey(
      'notes',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for social_accounts
    await queryRunner.createForeignKey(
      'social_accounts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for social_settings
    await queryRunner.createForeignKey(
      'social_settings',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for social_external_links
    await queryRunner.createForeignKey(
      'social_external_links',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys for social_external_links
    const socialExternalLinksTable = await queryRunner.getTable(
      'social_external_links'
    );
    const socialExternalLinksForeignKey =
      socialExternalLinksTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1
      );
    if (socialExternalLinksForeignKey) {
      await queryRunner.dropForeignKey(
        'social_external_links',
        socialExternalLinksForeignKey
      );
    }

    // Drop foreign keys for social_settings
    const socialSettingsTable = await queryRunner.getTable('social_settings');
    const socialSettingsForeignKey = socialSettingsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    if (socialSettingsForeignKey) {
      await queryRunner.dropForeignKey(
        'social_settings',
        socialSettingsForeignKey
      );
    }

    // Drop foreign keys for social_accounts
    const socialAccountsTable = await queryRunner.getTable('social_accounts');
    const socialAccountsForeignKey = socialAccountsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    if (socialAccountsForeignKey) {
      await queryRunner.dropForeignKey(
        'social_accounts',
        socialAccountsForeignKey
      );
    }

    // Drop foreign keys for notes
    const notesTable = await queryRunner.getTable('notes');
    const notesForeignKey = notesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    if (notesForeignKey) {
      await queryRunner.dropForeignKey('notes', notesForeignKey);
    }

    // Drop tables
    await queryRunner.dropTable('social_external_links');
    await queryRunner.dropTable('social_settings');
    await queryRunner.dropTable('social_accounts');
    await queryRunner.dropTable('notes');
  }
}
