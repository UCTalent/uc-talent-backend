import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUuidExtension1700000000000 implements MigrationInterface {
  name = 'CreateUuidExtension1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
