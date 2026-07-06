import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import {
  TenantConnectionManager,
  User,
  Organization,
  SchemaProvisionerService
} from "@nudum/database";

@Injectable()
export class AuthService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager,
    private readonly jwtService: JwtService,
    private readonly schemaProvisioner: SchemaProvisionerService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.findOne(User, {
        where: [{ email }, { username: email }],
        relations: ["organization"]
      });
    });

    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const result = { ...user };
      delete (result as any).passwordHash;
      return result;
    }
    throw new UnauthorizedException("Invalid email or password");
  }

  async login(user: any) {
    const subscriptions = await this.connectionManager.runPublic(async (entityManager) => {
      const { ModuleSubscription } = await import("../subscriptions/module-subscription.entity");
      return entityManager.find(ModuleSubscription, {
        where: { orgId: user.organizationId as string, status: "active" }
      });
    });

    const servicesMap: Record<string, boolean> = {
      archivi: subscriptions.some(
        (s) => s.moduleKey === "archivi" || s.moduleKey === ("archivi" as any)
      ),
      jawdati: subscriptions.some((s) => s.moduleKey === "jawdati"),
      mahattati: subscriptions.some((s) => s.moduleKey === "mahattati")
    };

    const payload = {
      email: user.email,
      sub: user.id,
      organizationId: user.organizationId,
      isPlatformAdmin: user.isPlatformAdmin,
      role: user.role,
      username: user.username,
      services: servicesMap
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || "24h"
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET || "refresh_secret_default_key",
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d"
      }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        isPlatformAdmin: user.isPlatformAdmin,
        services: servicesMap
      },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || "refresh_secret_default_key"
      });

      const user = await this.connectionManager.runPublic(async (entityManager) => {
        return entityManager.findOne(User, {
          where: { id: decoded.sub }
        });
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      const subscriptions = await this.connectionManager.runPublic(async (entityManager) => {
        const { ModuleSubscription } = await import("../subscriptions/module-subscription.entity");
        return entityManager.find(ModuleSubscription, {
          where: { orgId: user.organizationId as string, status: "active" }
        });
      });

      const servicesMap: Record<string, boolean> = {
        archivi: subscriptions.some(
          (s) => s.moduleKey === "archivi" || s.moduleKey === ("archivi" as any)
        ),
        jawdati: subscriptions.some((s) => s.moduleKey === "jawdati"),
        mahattati: subscriptions.some((s) => s.moduleKey === "mahattati")
      };

      const payload = {
        email: user.email,
        sub: user.id,
        organizationId: user.organizationId,
        isPlatformAdmin: user.isPlatformAdmin,
        role: user.role,
        username: user.username,
        services: servicesMap
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || "24h"
      });

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async register(dto: any) {
    const { organization, contact, email, plan, services, username, password } = dto;

    return this.connectionManager.runPublic(async (entityManager) => {
      // 1. Check if user already exists
      const existingUser = await entityManager.findOne(User, {
        where: [{ email }, { username }]
      });
      if (existingUser) {
        throw new Error("Username or Email already registered");
      }

      // 2. Create organization ID slug
      const orgId = organization
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .substring(0, 50);
      const existingOrg = await entityManager.findOne(Organization, { where: { id: orgId } });
      const finalOrgId = existingOrg ? `${orgId}_${Date.now().toString().slice(-4)}` : orgId;

      // 3. Provision Tenant Schema
      const schemaName = `tenant_${finalOrgId}`;
      try {
        await this.schemaProvisioner.provisionTenantSchema(finalOrgId);
      } catch (err) {
        console.error("Schema provisioning failed, defaulting schema name:", err);
      }

      // Plan pricing
      const starterPrice = 8000;
      const professionalPrice = 25000;
      const enterprisePrice = 95000;
      let price = starterPrice;
      if (plan === "Professional") price = professionalPrice;
      if (plan === "Enterprise") price = enterprisePrice;

      // 4. Save Organization (Member)
      const org = entityManager.create(Organization, {
        id: finalOrgId,
        name: organization,
        schemaName,
        contact,
        email,
        plan,
        status: "بانتظار التفعيل",
        renewal: "-",
        joinedAt: new Date().toISOString().split("T")[0],
        monthlyFee: price
      } as any);
      await entityManager.save(Organization, org);

      // 5. Create Default User Account
      const userId = `usr-${Date.now()}`;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = entityManager.create(User, {
        id: userId,
        email,
        passwordHash: hashedPassword,
        organizationId: finalOrgId,
        isPlatformAdmin: false,
        name: contact,
        username,
        role: "client"
      } as any);
      await entityManager.save(User, newUser);

      // 6. Create Active Module Subscriptions based on selected services
      const { ModuleSubscription } = await import("../subscriptions/module-subscription.entity");
      const serviceKeys = Object.keys(services).filter((k) => services[k]);
      for (const serviceKey of serviceKeys) {
        const sub = entityManager.create(ModuleSubscription, {
          id: `sub-${finalOrgId}-${serviceKey}`,
          orgId: finalOrgId,
          moduleKey: serviceKey as any,
          plan: plan.toLowerCase(),
          status: "active",
          activatedAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
        await entityManager.save(ModuleSubscription, sub);
      }

      // 7. Save Subscription Request
      const { SubscriptionRequest } = await import("@nudum/database");
      const req = entityManager.create(SubscriptionRequest, {
        id: `req-${Date.now()}`,
        orgId: finalOrgId,
        memberName: organization,
        type: "registration",
        requestedPlan: plan,
        requestedServices: serviceKeys,
        message: `طلب تسجيل جديد لمؤسسة "${organization}" في باقة ${plan}.`,
        status: "معلق"
      });
      await entityManager.save(SubscriptionRequest, req);

      // 8. Create Admin Alert
      const { Alert } = await import("@nudum/database");
      const alert = entityManager.create(Alert, {
        id: `alt-${Date.now()}`,
        title: "طلب تسجيل جديد",
        message: `طلب تسجيل جديد لمؤسسة "${organization}" في باقة ${plan}.`,
        type: "warning",
        read: false
      });
      await entityManager.save(Alert, alert);

      // 9. Add Audit Log
      const { AuditLog } = await import("@nudum/database");
      const audit = entityManager.create(AuditLog, {
        id: `aud-${Date.now()}`,
        username,
        action: "تسجيل مؤسسة جديدة",
        details: `تم تسجيل مؤسسة "${organization}" بنجاح في باقة ${plan} كحساب بانتظار التفعيل.`,
        ipAddress: null
      });
      await entityManager.save(AuditLog, audit);

      return {
        organizationId: finalOrgId,
        userId
      };
    });
  }
}
