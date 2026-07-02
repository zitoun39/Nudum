import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1719920000000 implements MigrationInterface {
  name = "InitialSetup1719920000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create organizations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.organizations (
        id varchar(50) NOT NULL,
        name varchar(255) NOT NULL,
        schema_name varchar(100) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT UQ_organizations_schema_name UNIQUE (schema_name),
        CONSTRAINT PK_organizations_id PRIMARY KEY (id)
      );
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.users (
        id varchar(50) NOT NULL,
        email varchar(255) NOT NULL,
        password_hash varchar(255) NOT NULL,
        is_platform_admin boolean NOT NULL DEFAULT false,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        organization_id varchar(50),
        CONSTRAINT UQ_users_email UNIQUE (email),
        CONSTRAINT PK_users_id PRIMARY KEY (id),
        CONSTRAINT FK_users_organization_id FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.organizations;`);
  }
}
