import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "./database/database.module";
import { TenantMiddleware } from "./database/tenant.middleware";
import { ArchiviModule } from "./modules/archivi/archivi.module";
import { StorageModule } from "./modules/storage/storage.module";
import { MahattatiModule } from "./modules/mahattati/mahattati.module";
import { JawdatiModule } from "./modules/jawdati/jawdati.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
    }),
    DatabaseModule,
    ArchiviModule,
    StorageModule,
    MahattatiModule,
    JawdatiModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
