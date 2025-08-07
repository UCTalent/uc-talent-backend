import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateUsers1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_status enum
    await queryRunner.query(`
      CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'locked')
    `);

    // Create users table
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
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phoneNumberCountry',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'encryptedPassword',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'firebaseUid',
            type: 'varchar',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'firebaseProvider',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'thirdwebMetadata',
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
            name: 'refCode',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'locationCityId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'isClickConfirmedForm',
            type: 'boolean',
            default: false,
          },
          {
            name: 'confirmationToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'confirmedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resetPasswordToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resetPasswordSentAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'signInCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'currentSignInAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'lastSignInAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'currentSignInIp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastSignInIp',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lockedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unlockToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'failedAttempts',
            type: 'integer',
            default: 0,
          },
          {
            name: 'rememberCreatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'unconfirmedEmail',
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

    // Create foreign key for location city
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['locationCityId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes
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
        columnNames: ['firebaseUid'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_LOCATION_CITY_ID',
        columnNames: ['locationCityId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('users', 'IDX_USERS_LOCATION_CITY_ID');
    await queryRunner.dropIndex('users', 'IDX_USERS_STATUS');
    await queryRunner.dropIndex('users', 'IDX_USERS_FIREBASE_UID');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    // Drop foreign key
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('locationCityId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('users', foreignKey);
    }

    // Drop table
    await queryRunner.dropTable('users');

    // Drop enum type
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
  }
}
