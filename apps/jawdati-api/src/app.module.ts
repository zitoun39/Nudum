import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule, TenantMiddleware } from "@nudum/database";
import { JawdatiModule } from "./modules/jawdati/jawdati.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
    }),
    DatabaseModule,
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
