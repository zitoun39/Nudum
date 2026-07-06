import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nudum/auth-client";
import { SupportService } from "./support.service";
import { CreateSupportTicketDto } from "./dto/support.dto";
import { TenantContextService } from "@nudum/database";

@Controller("platform/support")
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly tenantContext: TenantContextService
  ) {}

  // 🎫 Support Tickets
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateSupportTicketDto) {
    const orgId = this.tenantContext.getTenantId();
    const userId = this.tenantContext.getUserId() || "usr-admin";

    if (!orgId) {
      throw new UnauthorizedException("Session tenant context is missing");
    }

    return this.supportService.create(dto, userId, orgId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    const orgId = this.tenantContext.getTenantId();
    const isPlatformAdmin = this.tenantContext.isPlatformAdmin();

    if (isPlatformAdmin) {
      return this.supportService.findAll();
    }

    if (!orgId) {
      throw new UnauthorizedException("Session tenant context is missing");
    }

    return this.supportService.findAll(orgId);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  async update(@Param("id") id: string, @Body() body: { status: string; reply?: string }) {
    const store = this.tenantContext.getStore();
    const username = store?.email || "admin@nudum.dz";
    return this.supportService.update(id, body.status, body.reply, username);
  }

  // 🔔 Alerts
  @Get("alerts")
  @UseGuards(AuthGuard)
  async getAlerts() {
    return this.supportService.getAlerts();
  }

  @Put("alerts/:id/read")
  @UseGuards(AuthGuard)
  async markAlertRead(@Param("id") id: string) {
    return this.supportService.markAlertRead(id);
  }

  @Put("alerts/read-all")
  @UseGuards(AuthGuard)
  async markAllAlertsRead() {
    await this.supportService.markAllAlertsRead();
    return { success: true };
  }

  // ❓ Client Questions (Public POST)
  @Post("questions")
  async createQuestion(@Body() dto: { name: string; email: string; message: string }) {
    return this.supportService.createQuestion(dto);
  }

  @Get("questions")
  @UseGuards(AuthGuard)
  async getQuestions() {
    return this.supportService.findAllQuestions();
  }

  @Put("questions/:id/reply")
  @UseGuards(AuthGuard)
  async replyToQuestion(@Param("id") id: string, @Body() body: { reply: string }) {
    const store = this.tenantContext.getStore();
    const username = store?.email || "admin@nudum.dz";
    return this.supportService.replyToQuestion(id, body.reply, username);
  }

  @Put("questions/:id/read")
  @UseGuards(AuthGuard)
  async markQuestionRead(@Param("id") id: string) {
    return this.supportService.markQuestionRead(id);
  }

  // 📜 Audit Logs
  @Get("audit-logs")
  @UseGuards(AuthGuard)
  async getAuditLogs() {
    return this.supportService.getAuditLogs();
  }

  @Delete("audit-logs")
  @UseGuards(AuthGuard)
  async clearAuditLogs() {
    await this.supportService.clearAuditLogs();
    return { success: true };
  }

  // 📊 Stats
  @Get("stats")
  @UseGuards(AuthGuard)
  async getStats() {
    return this.supportService.getSalesStats();
  }
}
