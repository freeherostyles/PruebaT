import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1783710000000 implements MigrationInterface {
  name = 'CreateUsersTable1783710000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'EXECUTIVE')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "full_name" character varying(150) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
  }
}
