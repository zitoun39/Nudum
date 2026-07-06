import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables early
dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Validate critical environment variables on startup
const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing critical environment variable: ${envVar}`);
  }
}

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global route prefix
  app.setGlobalPrefix("api");

  // Apply security headers
  app.use(helmet());

  // Parse HTTP Cookies
  app.use(cookieParser());

  // Enforce DTO validation rules globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Harden CORS for credentialed HttpOnly cookie access
  const allowedOrigins = process.env.WEB_ORIGIN
    ? process.env.WEB_ORIGIN.split(",")
    : ["http://localhost:3000", "http://localhost:5173"];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true
  });

  const port = process.env.PORT || 5003;
  await app.listen(port);
  console.log(`نُظُم | Nudum Archivi API running on: http://localhost:${port}`);
}
bootstrap();
