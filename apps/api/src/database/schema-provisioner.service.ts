import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SchemaProvisionerService {
  private readonly logger = new Logger(SchemaProvisionerService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Bootstraps the public schema table structures if they do not exist.
   */
  async bootstrapPublicSchema(): Promise<void> {
    this.logger.log("Checking and bootstrapping public schema structures...");
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Create public.organizations
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.organizations (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          schema_name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create public.users
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.users (
          id VARCHAR(50) PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          organization_id VARCHAR(50) REFERENCES public.organizations(id) ON DELETE SET NULL,
          is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await queryRunner.commitTransaction();
      this.logger.log("Public schema bootstrapped successfully.");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Failed to bootstrap public schema:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Dynamic tenant schema provisioning. Creates a schema and seeds roles.
   */
  async provisionTenantSchema(tenantId: string): Promise<string> {
    const schemaName = `tenant_${tenantId.toLowerCase().replace(/[^a-z0-9_]/g, "")}`;
    this.logger.log(`Provisioning isolated tenant schema: ${schemaName}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Create schema
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

      // Create roles table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}".roles (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create permissions table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}".permissions (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        );
      `);

      // Create role_permissions join table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}".role_permissions (
          role_id VARCHAR(50) REFERENCES "${schemaName}".roles(id) ON DELETE CASCADE,
          permission_id VARCHAR(100) REFERENCES "${schemaName}".permissions(id) ON DELETE CASCADE,
          PRIMARY KEY (role_id, permission_id)
        );
      `);

      // Create user profile table (referencing global user ID)
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "${schemaName}".users (
          id VARCHAR(50) PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role_id VARCHAR(50) REFERENCES "${schemaName}".roles(id) ON DELETE SET NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed baseline tenant roles
      await queryRunner.query(`
        INSERT INTO "${schemaName}".roles (id, name) VALUES
        ('admin', 'Admin'),
        ('operator', 'Operator'),
        ('analyst', 'Lab Analyst')
        ON CONFLICT (id) DO NOTHING;
      `);

      await queryRunner.commitTransaction();
      this.logger.log(`Tenant schema ${schemaName} provisioned successfully.`);
      return schemaName;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to provision schema ${schemaName}:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
