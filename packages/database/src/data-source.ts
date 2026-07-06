import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load monorepo root environment variables
dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, "entities/**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "migrations/public/*{.ts,.js}")]
});
