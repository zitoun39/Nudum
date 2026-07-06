import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { TenantContextService } from "./tenant-context.service";

@Injectable()
export class TenantConnectionManager {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContextService
  ) {}

  /**
   * Executes database operations inside an isolated, transaction-bound connection pool session
   * and sets localized schema search path to prevent PgBouncer connection leaks.
   */
  async runInTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    const schema = this.tenantContext.getSchemaName() || "public";
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Escape/sanitize schema name to avoid SQL Injection vectors
      const sanitizedSchema = schema.replace(/[^a-zA-Z0-9_]/g, "");
      await queryRunner.query(`SET LOCAL search_path TO "${sanitizedSchema}", public;`);

      const result = await callback(queryRunner.manager);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Executes database operations on the shared public schema.
   */
  async runPublic<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.query("SET LOCAL search_path TO public;");
      return await callback(queryRunner.manager);
    } finally {
      await queryRunner.release();
    }
  }
}
