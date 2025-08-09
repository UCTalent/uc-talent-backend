import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAdminEntities1700000000014 implements MigrationInterface {
  name = 'CreateAdminEntities1700000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create admins table
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'encrypted_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',
            default: "'admin'",
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
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

    // Create admin_sessions table
    await queryRunner.createTable(
      new Table({
        name: 'admin_sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'admin_id',
            type: 'uuid',
          },
          {
            name: 'token',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
          {
            name: 'ip_address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_agent',
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
      true
    );

    // Create admin_permissions table
    await queryRunner.createTable(
      new Table({
        name: 'admin_permissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'admin_id',
            type: 'uuid',
          },
          {
            name: 'resource',
            type: 'varchar',
          },
          {
            name: 'action',
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

    // Create audit_logs table
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'admin_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
          },
          {
            name: 'resource_type',
            type: 'varchar',
          },
          {
            name: 'resource_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'details',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create system_settings table
    await queryRunner.createTable(
      new Table({
        name: 'system_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'key',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'value',
            type: 'text',
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
      true
    );

    // Create indexes for admins
    await queryRunner.createIndex(
      'admins',
      new TableIndex({
        name: 'IDX_ADMINS_EMAIL',
        columnNames: ['email'],
      })
    );

    // Create indexes for admin_sessions
    await queryRunner.createIndex(
      'admin_sessions',
      new TableIndex({
        name: 'IDX_ADMIN_SESSIONS_TOKEN',
        columnNames: ['token'],
      })
    );

    // Create indexes for audit_logs
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_LOGS_ADMIN_ID',
        columnNames: ['admin_id'],
      })
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_AUDIT_LOGS_ACTION',
        columnNames: ['action'],
      })
    );

    // Create foreign keys for admin_sessions
    await queryRunner.createForeignKey(
      'admin_sessions',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for admin_permissions
    await queryRunner.createForeignKey(
      'admin_permissions',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'CASCADE',
      })
    );

    // Create foreign keys for audit_logs
    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['admin_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes for audit_logs
    await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ACTION');
    await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ADMIN_ID');

    // Drop indexes for admin_sessions
    await queryRunner.dropIndex('admin_sessions', 'IDX_ADMIN_SESSIONS_TOKEN');

    // Drop indexes for admins
    await queryRunner.dropIndex('admins', 'IDX_ADMINS_EMAIL');

    // Drop foreign keys for audit_logs
    const auditLogsTable = await queryRunner.getTable('audit_logs');
    const auditLogsForeignKey = auditLogsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('admin_id') !== -1
    );
    if (auditLogsForeignKey) {
      await queryRunner.dropForeignKey('audit_logs', auditLogsForeignKey);
    }

    // Drop foreign keys for admin_permissions
    const adminPermissionsTable =
      await queryRunner.getTable('admin_permissions');
    const adminPermissionsForeignKey = adminPermissionsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('admin_id') !== -1
    );
    if (adminPermissionsForeignKey) {
      await queryRunner.dropForeignKey(
        'admin_permissions',
        adminPermissionsForeignKey
      );
    }

    // Drop foreign keys for admin_sessions
    const adminSessionsTable = await queryRunner.getTable('admin_sessions');
    const adminSessionsForeignKey = adminSessionsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('admin_id') !== -1
    );
    if (adminSessionsForeignKey) {
      await queryRunner.dropForeignKey(
        'admin_sessions',
        adminSessionsForeignKey
      );
    }

    // Drop tables
    await queryRunner.dropTable('system_settings');
    await queryRunner.dropTable('audit_logs');
    await queryRunner.dropTable('admin_permissions');
    await queryRunner.dropTable('admin_sessions');
    await queryRunner.dropTable('admins');
  }
}
