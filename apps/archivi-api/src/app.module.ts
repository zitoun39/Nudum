import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule, TenantMiddleware } from "@nudum/database";
import { ArchiviModule } from "./modules/archivi/archivi.module";
import { StorageModule } from "./modules/storage/storage.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
    }),
    DatabaseModule,
    ArchiviModule,
    StorageModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
