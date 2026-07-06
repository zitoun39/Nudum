import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { TenantContextService } from "@nudum/database";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tenantContext: TenantContextService) {}

  canActivate(_context: ExecutionContext): boolean {
    const store = this.tenantContext.getStore();
    if (!store || (!store.tenantId && !store.isPlatformAdmin)) {
      throw new UnauthorizedException("Unauthorized access: invalid session context");
    }
    return true;
  }
}
