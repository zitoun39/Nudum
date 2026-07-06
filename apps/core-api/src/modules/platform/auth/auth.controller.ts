import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/auth.dto";
import { AuthGuard } from "@nudum/auth-client";
import { TenantContextService, TenantConnectionManager, User } from "@nudum/database";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tenantContext: TenantContextService,
    private readonly connectionManager: TenantConnectionManager
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: any) {
    try {
      const result = await this.authService.register(dto);
      return { success: true, ...result };
    } catch (err: any) {
      throw new UnauthorizedException(err.message || "Registration failed");
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const validatedUser = await this.authService.validateUser(dto.email, dto.password);
    const result = await this.authService.login(validatedUser);

    res.cookie("__Host-Access-Token", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });

    res.cookie("__Host-Refresh-Token", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });

    return { user: result.user, token: result.accessToken };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe() {
    const store = this.tenantContext.getStore();
    if (!store || !store.userId) {
      throw new UnauthorizedException("Session context is missing");
    }

    const user = await this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.findOne(User, {
        where: { id: store.userId },
        relations: ["organization"]
      });
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
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

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      isPlatformAdmin: user.isPlatformAdmin,
      organization: user.organization,
      services: servicesMap
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.["__Host-Refresh-Token"] || req.headers["x-refresh-token"];
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }

    const result = await this.authService.refresh(refreshToken as string);

    res.cookie("__Host-Access-Token", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });

    return { success: true, token: result.accessToken };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("__Host-Access-Token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });
    res.clearCookie("__Host-Refresh-Token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });
    return { success: true };
  }
}
