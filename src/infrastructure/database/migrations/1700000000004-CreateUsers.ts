import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateUsers1700000000004 implements MigrationInterface {
  name = 'CreateUsers1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'locked')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number_country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'encrypted_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'firebase_uid',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'firebase_provider',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'thirdweb_metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'uid',
            type: 'text',
            isArray: true,
            default: "'{}'",
          },
          {
            name: 'ref_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location_city_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_click_confirmed_form',
            type: 'boolean',
            default: false,
          },
          {
            name: 'confirmation_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'reset_password_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reset_password_sent_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'sign_in_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'current_sign_in_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_sign_in_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'current_sign_in_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_sign_in_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'locked_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unlock_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'failed_attempts',
            type: 'integer',
            default: 0,
          },
          {
            name: 'remember_created_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unconfirmed_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'locked'],
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
      true,
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['location_city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_FIREBASE_UID',
        columnNames: ['firebase_uid'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USERS_FIREBASE_UID');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('location_city_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('users', foreignKey);
    }

    await queryRunner.dropTable('users');
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
  }
}
