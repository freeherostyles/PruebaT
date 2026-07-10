import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSuppliersTable1783717346129 implements MigrationInterface {
  name = 'CreateSuppliersTable1783717346129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."suppliers_supplier_type_enum" AS ENUM('PERSONA_FISICA', 'PERSONA_MORAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."suppliers_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "suppliers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "supplier_type" "public"."suppliers_supplier_type_enum" NOT NULL, "status" "public"."suppliers_status_enum" NOT NULL DEFAULT 'ACTIVE', "first_name" character varying(100), "last_name" character varying(100), "second_last_name" character varying(100), "business_name" character varying(200), "trade_name" character varying(200), "rfc" character varying(13) NOT NULL, "curp" character varying(18), "contact_person" character varying(150), "email" character varying(255), "phone" character varying(30), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, CONSTRAINT "UQ_fb19520682afb21a9037336fa7b" UNIQUE ("rfc"), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_suppliers_supplier_type" ON "suppliers" ("supplier_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_suppliers_status" ON "suppliers" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_suppliers_rfc" ON "suppliers" ("rfc")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_suppliers_created_at" ON "suppliers" ("created_at")`,
    );
    await queryRunner.query(
      `ALTER TABLE "suppliers" ADD CONSTRAINT "FK_4be40fae84ce82ed3baef4a49fa" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "suppliers" DROP CONSTRAINT "FK_4be40fae84ce82ed3baef4a49fa"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_suppliers_created_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_suppliers_rfc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_suppliers_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_suppliers_supplier_type"`,
    );
    await queryRunner.query(`DROP TABLE "suppliers"`);
    await queryRunner.query(`DROP TYPE "public"."suppliers_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."suppliers_supplier_type_enum"`,
    );
  }
}
