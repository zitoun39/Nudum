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
import { SubscriptionsService } from "./subscriptions.service";
import { TenantContextService } from "@nudum/database";

@Controller("platform/subscriptions")
@UseGuards(AuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get("me")
  async getMySubscriptions() {
    const orgId = this.tenantContext.getTenantId();
    if (!orgId) {
      if (this.tenantContext.isPlatformAdmin()) {
        return [];
      }
      throw new UnauthorizedException("No active tenant context resolved for request");
    }
    return this.subscriptionsService.getSubscriptions(orgId);
  }

  // 🏢 Organizations (Members)
  @Get("members")
  async getMembers() {
    return this.subscriptionsService.getMembers();
  }

  @Put("members/:id")
  async updateMember(@Param("id") id: string, @Body() body: any) {
    return this.subscriptionsService.updateMember(id, body);
  }

  @Delete("members/:id")
  async deleteMember(@Param("id") id: string) {
    await this.subscriptionsService.deleteMember(id);
    return { success: true };
  }

  // 📝 Subscription Requests
  @Get("requests")
  async getSubscriptionRequests() {
    return this.subscriptionsService.getSubscriptionRequests();
  }

  @Post("requests")
  async addSubscriptionRequest(@Body() dto: any) {
    const orgId = this.tenantContext.getTenantId() || dto.orgId;
    if (!orgId) throw new UnauthorizedException("Organization context is missing");
    return this.subscriptionsService.addSubscriptionRequest({ ...dto, orgId });
  }

  @Put("requests/:id/approve")
  async approveRequest(@Param("id") id: string) {
    const store = this.tenantContext.getStore();
    const username = store?.email || "admin@nudum.dz";
    return this.subscriptionsService.approveSubscriptionRequest(id, username);
  }

  @Put("requests/:id/reject")
  async rejectRequest(@Param("id") id: string, @Body() body: { reason?: string }) {
    const store = this.tenantContext.getStore();
    const username = store?.email || "admin@nudum.dz";
    return this.subscriptionsService.rejectSubscriptionRequest(
      id,
      body.reason || "Rejection by Administrator",
      username
    );
  }

  // 🧾 Invoices
  @Get("invoices")
  async getInvoices() {
    const orgId = this.tenantContext.getTenantId();
    const isPlatformAdmin = this.tenantContext.isPlatformAdmin();

    if (isPlatformAdmin) {
      return this.subscriptionsService.getInvoices();
    }

    if (!orgId) throw new UnauthorizedException("Tenant context missing");
    return this.subscriptionsService.getInvoices(orgId);
  }

  @Post("invoices")
  async addInvoice(@Body() body: any) {
    return this.subscriptionsService.addInvoice(body);
  }

  @Put("invoices/:id")
  async updateInvoiceStatus(
    @Param("id") id: string,
    @Body() body: { status: string; paidAt?: string; receiptFileId?: string }
  ) {
    const store = this.tenantContext.getStore();
    const username = store?.email || "admin@nudum.dz";
    return this.subscriptionsService.updateInvoiceStatus(
      id,
      body.status,
      body.paidAt,
      body.receiptFileId,
      username
    );
  }

  // 🔑 User Accounts (Access Control)
  @Get("users")
  async getUserAccounts() {
    return this.subscriptionsService.getUserAccounts();
  }

  @Post("users")
  async addUserAccount(@Body() dto: any) {
    return this.subscriptionsService.addUserAccount(dto);
  }

  @Delete("users/:id")
  async deleteUser(@Param("id") id: string) {
    await this.subscriptionsService.deleteUser(id);
    return { success: true };
  }
}
