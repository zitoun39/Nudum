import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantSetup1719921000000 implements MigrationInterface {
  name = "TenantSetup1719921000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id varchar(50) NOT NULL,
        name varchar(100) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT UQ_roles_name UNIQUE (name),
        CONSTRAINT PK_roles_id PRIMARY KEY (id)
      );
    `);

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id varchar(100) NOT NULL,
        name varchar(255) NOT NULL,
        CONSTRAINT PK_permissions_id PRIMARY KEY (id)
      );
    `);

    // Create role_permissions join table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id varchar(50) NOT NULL,
        permission_id varchar(100) NOT NULL,
        CONSTRAINT PK_role_permissions PRIMARY KEY (role_id, permission_id),
        CONSTRAINT FK_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT FK_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      );
    `);

    // Create user profiles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar(50) NOT NULL,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        role_id varchar(50),
        CONSTRAINT PK_users_tenant_id PRIMARY KEY (id),
        CONSTRAINT FK_users_tenant_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );
    `);

    // Seed baseline tenant roles
    await queryRunner.query(`
      INSERT INTO roles (id, name) VALUES
      ('admin', 'Admin'),
      ('operator', 'Operator'),
      ('analyst', 'Lab Analyst')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}
