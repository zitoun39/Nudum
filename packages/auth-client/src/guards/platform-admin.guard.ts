import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { TenantContextService } from "@nudum/database";

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(private readonly tenantContext: TenantContextService) {}

  canActivate(_context: ExecutionContext): boolean {
    if (!this.tenantContext.isPlatformAdmin()) {
      throw new ForbiddenException(
        "Only platform administrators are permitted to access this resource"
      );
    }
    return true;
  }
}
