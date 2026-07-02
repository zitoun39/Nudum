import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { TenantContextService } from "./tenant-context.service";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly jwtService: JwtService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.["__Host-Access-Token"] || this.extractBearerToken(req);

    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET
        }) as any;

        if (payload) {
          const tenantId = payload.organizationId;
          const isPlatformAdmin = !!payload.isPlatformAdmin;
          const schemaName = tenantId
            ? `tenant_${tenantId.toLowerCase().replace(/[^a-z0-9_]/g, "")}`
            : "public";

          return this.tenantContextService.run({ tenantId, schemaName, isPlatformAdmin }, () =>
            next()
          );
        }
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }

    // Fallback: Default to public context if no token is supplied
    return this.tenantContextService.run({ schemaName: "public" }, () => next());
  }

  private extractBearerToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }
}
