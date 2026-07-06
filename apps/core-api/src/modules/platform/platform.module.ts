import { Module, Global } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { SubscriptionsService } from "./subscriptions/subscriptions.service";
import { SubscriptionsController } from "./subscriptions/subscriptions.controller";
import { SupportService } from "./support/support.service";
import { SupportController } from "./support/support.controller";

@Global()
@Module({
  imports: [],
  controllers: [AuthController, SubscriptionsController, SupportController],
  providers: [AuthService, SubscriptionsService, SupportService],
  exports: [AuthService, SubscriptionsService, SupportService]
})
export class PlatformModule {}
