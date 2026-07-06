import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import {
  TenantConnectionManager,
  Invoice,
  SubscriptionRequest,
  Alert,
  AuditLog,
  User,
  Organization
} from "@nudum/database";
import { ModuleSubscription } from "./module-subscription.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async isActive(orgId: string, moduleKey: string): Promise<boolean> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const sub = await entityManager.findOne(ModuleSubscription, {
        where: {
          orgId,
          moduleKey: moduleKey as any,
          status: "active"
        }
      });
      if (!sub) return false;
      return sub.expiresAt > new Date();
    });
  }

  async getSubscriptions(orgId: string): Promise<ModuleSubscription[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(ModuleSubscription, {
        where: { orgId }
      });
    });
  }

  // 🏢 Organizations (Members)
  async getMembers(): Promise<Organization[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(Organization, {
        order: { name: "ASC" }
      });
    });
  }

  async updateMember(id: string, data: any): Promise<Organization> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const org = await entityManager.findOne(Organization, { where: { id } });
      if (!org) throw new NotFoundException("Organization not found");

      Object.assign(org, data);
      return entityManager.save(Organization, org);
    });
  }

  async deleteMember(id: string): Promise<void> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const org = await entityManager.findOne(Organization, { where: { id } });
      if (!org) throw new NotFoundException("Organization not found");

      // Cascading deletes
      await entityManager.delete(User, { organizationId: id });
      await entityManager.delete(ModuleSubscription, { orgId: id });
      await entityManager.delete(Invoice, { orgId: id });
      await entityManager.delete(SubscriptionRequest, { orgId: id });
      await entityManager.delete(Organization, { id });

      // Add audit log
      const audit = entityManager.create(AuditLog, {
        id: `aud-${Date.now()}`,
        username: "admin@nudum.dz",
        action: "حذف مؤسسة",
        details: `تم حذف المؤسسة (${org.name}) وكافة حساباتها وفواتيرها وتذاكرها نهائياً.`,
        ipAddress: null
      });
      await entityManager.save(AuditLog, audit);
    });
  }

  // 📝 Subscription Requests
  async getSubscriptionRequests(): Promise<SubscriptionRequest[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(SubscriptionRequest, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async addSubscriptionRequest(dto: any): Promise<SubscriptionRequest> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const org = await entityManager.findOne(Organization, { where: { id: dto.orgId } });
      const memberName = org ? org.name : "Unknown Member";

      const req = entityManager.create(SubscriptionRequest, {
        id: `req-${Date.now()}`,
        orgId: dto.orgId,
        memberName,
        type: dto.type,
        currentPlan: org ? org.plan : null,
        requestedPlan: dto.requestedPlan || null,
        requestedServices: dto.requestedServices || null,
        message: dto.message || "",
        status: "معلق"
      });

      const saved = await entityManager.save(SubscriptionRequest, req);

      // Create Admin Alert
      const alert = entityManager.create(Alert, {
        id: `alt-${Date.now()}`,
        title: "طلب اشتراك جديد",
        message: dto.message || `طلب تغيير باقة/خدمة جديد من ${memberName}`,
        type: "warning",
        read: false
      });
      await entityManager.save(Alert, alert);

      return saved;
    });
  }

  async approveSubscriptionRequest(id: string, username: string): Promise<SubscriptionRequest> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const req = await entityManager.findOne(SubscriptionRequest, { where: { id } });
      if (!req) throw new NotFoundException("Subscription request not found");

      req.status = "مقبول";
      req.resolvedAt = new Date().toISOString();
      req.resolvedBy = username;

      // Apply changes based on request type
      const org = await entityManager.findOne(Organization, { where: { id: req.orgId } });
      if (org) {
        if (req.type === "registration") {
          org.status = "نشط";
          org.renewal = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
          await entityManager.save(Organization, org);
        } else if (req.type === "upgrade" || req.type === "downgrade") {
          org.plan = req.requestedPlan || org.plan;
          const starterPrice = 8000;
          const professionalPrice = 25000;
          const enterprisePrice = 95000;
          let price = starterPrice;
          if (org.plan === "Professional") price = professionalPrice;
          if (org.plan === "Enterprise") price = enterprisePrice;
          org.monthlyFee = price;
          await entityManager.save(Organization, org);
        } else if (req.type === "service_activation") {
          if (req.requestedServices && Array.isArray(req.requestedServices)) {
            for (const serviceKey of req.requestedServices) {
              const subId = `sub-${org.id}-${serviceKey}`;
              let sub = await entityManager.findOne(ModuleSubscription, { where: { id: subId } });
              if (!sub) {
                sub = entityManager.create(ModuleSubscription, {
                  id: subId,
                  orgId: org.id,
                  moduleKey: serviceKey as any,
                  plan: org.plan.toLowerCase(),
                  status: "active",
                  activatedAt: new Date(),
                  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                });
              } else {
                sub.status = "active";
                sub.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
              }
              await entityManager.save(ModuleSubscription, sub);
            }
          }
        }
      }

      await entityManager.save(SubscriptionRequest, req);

      // Create Admin Alert
      const alert = entityManager.create(Alert, {
        id: `alt-${Date.now()}`,
        title: "قبول طلب الاشتراك",
        message: `تم قبول طلب الاشتراك (${req.type}) للمشترك "${req.memberName}".`,
        type: "success",
        read: false
      });
      await entityManager.save(Alert, alert);

      // Add audit log
      const audit = entityManager.create(AuditLog, {
        id: `aud-${Date.now()}`,
        username,
        action: "موافقة طلب اشتراك",
        details: `تمت الموافقة على طلب (${req.type}) للمشترك "${req.memberName}".`,
        ipAddress: null
      });
      await entityManager.save(AuditLog, audit);

      return req;
    });
  }

  async rejectSubscriptionRequest(
    id: string,
    reason: string,
    username: string
  ): Promise<SubscriptionRequest> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const req = await entityManager.findOne(SubscriptionRequest, { where: { id } });
      if (!req) throw new NotFoundException("Subscription request not found");

      req.status = "مرفوض";
      req.rejectionReason = reason;
      req.resolvedAt = new Date().toISOString();
      req.resolvedBy = username;

      await entityManager.save(SubscriptionRequest, req);

      // Add audit log
      const audit = entityManager.create(AuditLog, {
        id: `aud-${Date.now()}`,
        username,
        action: "رفض طلب اشتراك",
        details: `تم رفض طلب (${req.type}) للمشترك "${req.memberName}" بسبب: ${reason}.`,
        ipAddress: null
      });
      await entityManager.save(AuditLog, audit);

      return req;
    });
  }

  // 🧾 Invoices
  async getInvoices(orgId?: string): Promise<Invoice[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      if (orgId) {
        return entityManager.find(Invoice, {
          where: { orgId },
          order: { createdAt: "DESC" }
        });
      }
      return entityManager.find(Invoice, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async addInvoice(invoiceData: any): Promise<Invoice> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const org = await entityManager.findOne(Organization, { where: { id: invoiceData.orgId } });
      if (!org) throw new NotFoundException("Organization not found");

      const count = await entityManager.count(Invoice);
      const invoiceSeq = count + 1;
      const year = new Date().getFullYear();
      const invoiceNumber = `INV-${year}-${String(invoiceSeq).padStart(3, "0")}`;

      const id = `inv-${Date.now()}`;
      const issuedAt = new Date().toISOString().split("T")[0];

      const invoice = entityManager.create(Invoice, {
        id,
        orgId: invoiceData.orgId,
        memberName: org.name,
        invoiceNumber,
        amount: invoiceData.amount,
        status: "معلق",
        issuedAt,
        dueAt:
          invoiceData.dueAt ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        items: invoiceData.items || [{ description: "اشتراك شهري", amount: invoiceData.amount }],
        notes: invoiceData.notes || ""
      });

      const saved = await entityManager.save(Invoice, invoice);

      // Create Alert
      const alert = entityManager.create(Alert, {
        id: `alt-${Date.now()}`,
        title: "فاتورة جديدة",
        message: `تم إنشاء فاتورة جديدة رقم ${invoiceNumber} بقيمة ${invoiceData.amount} د.ج للمشترك ${org.name}.`,
        type: "info",
        read: false
      });
      await entityManager.save(Alert, alert);

      return saved;
    });
  }

  async updateInvoiceStatus(
    id: string,
    status: string,
    paidAt?: string,
    receiptFileId?: string,
    username?: string
  ): Promise<Invoice> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const invoice = await entityManager.findOne(Invoice, { where: { id } });
      if (!invoice) throw new NotFoundException("Invoice not found");

      invoice.status = status;
      if (paidAt) invoice.paidAt = paidAt;
      if (receiptFileId) invoice.receiptFileId = receiptFileId;

      const updated = await entityManager.save(Invoice, invoice);

      if (status === "مدفوع") {
        // Create success Alert
        const alert = entityManager.create(Alert, {
          id: `alt-${Date.now()}`,
          title: "تأكيد دفع الفاتورة",
          message: `تم تأكيد دفع الفاتورة ${invoice.invoiceNumber} للمشترك ${invoice.memberName}.`,
          type: "success",
          read: false
        });
        await entityManager.save(Alert, alert);

        // Add audit log
        if (username) {
          const audit = entityManager.create(AuditLog, {
            id: `aud-${Date.now()}`,
            username,
            action: "دفع فاتورة",
            details: `تم تأكيد دفع الفاتورة رقم: ${invoice.invoiceNumber} بقيمة: ${invoice.amount} د.ج للمشترك: ${invoice.memberName}.`,
            ipAddress: null
          });
          await entityManager.save(AuditLog, audit);
        }
      }

      return updated;
    });
  }

  // 🔑 User Accounts
  async getUserAccounts(): Promise<User[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(User, {
        relations: ["organization"],
        order: { createdAt: "DESC" }
      });
    });
  }

  async addUserAccount(dto: any): Promise<User> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const check = await entityManager.findOne(User, { where: { email: dto.email } });
      if (check) throw new Error("Email already registered");

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = entityManager.create(User, {
        id: `usr-${Date.now()}`,
        email: dto.email,
        username: dto.username,
        name: dto.name,
        passwordHash: hashedPassword,
        organizationId: dto.memberId || dto.organizationId,
        role: dto.role || "client",
        isPlatformAdmin: dto.role === "admin"
      } as any);

      return entityManager.save(User, user);
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.connectionManager.runPublic(async (entityManager) => {
      await entityManager.delete(User, { id });
    });
  }
}
