import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenantContextService } from "./tenant-context.service";
import { TenantConnectionManager } from "./tenant-connection-manager";
import { SchemaProvisionerService } from "./schema-provisioner.service";
import * as dotenv from "dotenv";
import * as path from "path";

// Locate and load environment variables from monorepo root
dotenv.config({ path: path.join(__dirname, "../../../../.env") });

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER || "nudum_admin",
      password: process.env.DB_PASSWORD || "nudum_secure_pass_2026",
      database: process.env.DB_NAME || "nudum_db",
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: false, // Enforce programmatic migrations execution only
      logging: process.env.NODE_ENV === "development" ? ["error"] : ["error"]
    })
  ],
  providers: [TenantContextService, TenantConnectionManager, SchemaProvisionerService],
  exports: [TenantContextService, TenantConnectionManager, SchemaProvisionerService, TypeOrmModule]
})
export class DatabaseModule {}
