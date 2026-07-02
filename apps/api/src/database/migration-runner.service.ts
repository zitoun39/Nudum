import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import * as path from "path";

@Injectable()
export class MigrationRunnerService implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunnerService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.runAllMigrations();
  }

  /**
   * Orchestrates the execution of all migrations across the public schema
   * and subsequently loops over all registered tenant schemas.
   */
  async runAllMigrations(): Promise<void> {
    this.logger.log("Initializing programmatic multi-tenant database migration runner...");

    try {
      // 1. Run public migrations
      await this.runPublicMigrations();

      // 2. Run tenant-scoped migrations
      await this.runTenantMigrations();

      this.logger.log("All database migrations executed successfully.");
    } catch (error) {
      this.logger.error("Failed to execute database migrations:", error);
      throw error;
    }
  }

  /**
   * Runs migrations targeted for the global public schema.
   */
  private async runPublicMigrations(): Promise<void> {
    this.logger.log("Executing public schema migrations...");
    await this.dataSource.runMigrations();
    this.logger.log("Public schema migrations execution complete.");
  }

  /**
   * Loops through all registered organizations and runs tenant migrations on their isolated schemas.
   */
  private async runTenantMigrations(): Promise<void> {
    this.logger.log("Fetching registered tenants for schema migration...");

    // Query all organizations registered in the public schema
    const orgs: Array<{ id: string; schema_name: string }> = await this.dataSource.query(
      "SELECT id, schema_name FROM public.organizations"
    );

    this.logger.log(`Found ${orgs.length} registered tenant schema(s) to migrate.`);

    for (const org of orgs) {
      const schemaName = org.schema_name;
      this.logger.log(`Executing migrations for tenant: ${org.id} [Schema: ${schemaName}]`);

      // Instantiate a connection to run tenant-scoped migrations on their respective schema context
      const tenantDataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: schemaName,
        synchronize: false,
        logging: ["error"],
        entities: [path.join(__dirname, "entities/**/*.entity{.ts,.js}")],
        migrations: [path.join(__dirname, "migrations/tenant/*{.ts,.js}")],
        migrationsTableName: "migrations"
      });

      try {
        await tenantDataSource.initialize();
        await tenantDataSource.runMigrations();
        this.logger.log(`Tenant ${org.id} schema migrations completed successfully.`);
      } catch (error) {
        this.logger.error(`Failed to run migrations for tenant ${org.id}:`, error);
        throw error;
      } finally {
        if (tenantDataSource.isInitialized) {
          await tenantDataSource.destroy();
        }
      }
    }
  }
}
