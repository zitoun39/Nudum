import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TenantContextService } from "@nudum/database";
import { DataSource } from "typeorm";

export const RequireModule = (key: string) => SetMetadata("module", key);

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantContext: TenantContextService,
    private readonly dataSource: DataSource
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule =
      this.reflector.get<string>("module", context.getHandler()) ||
      this.reflector.get<string>("module", context.getClass());

    if (!requiredModule) {
      return true;
    }

    if (this.tenantContext.isPlatformAdmin()) {
      return true;
    }

    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) {
      throw new UnauthorizedException("Session tenant context is missing");
    }

    // Query subscription state directly from public.module_subscriptions using the connection DataSource
    const subscriptions = await this.dataSource.query(
      `SELECT 1 FROM public.module_subscriptions WHERE org_id = $1 AND module_key = $2 AND status = 'active' AND expires_at > now()`,
      [tenantId, requiredModule]
    );

    const active = subscriptions && subscriptions.length > 0;
    if (!active) {
      throw new ForbiddenException(
        `Module "${requiredModule}" is not active or subscribed for this organization`
      );
    }

    return true;
  }
}
