import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import {
  TenantConnectionManager,
  ClientQuestion,
  Alert,
  AuditLog,
  Invoice,
  Organization
} from "@nudum/database";
import { SupportTicket } from "./support-ticket.entity";
import { CreateSupportTicketDto } from "./dto/support.dto";

@Injectable()
export class SupportService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  // 🎫 Support Tickets
  async create(dto: CreateSupportTicketDto, userId: string, orgId: string): Promise<SupportTicket> {
    return this.connectionManager.runPublic(async (entityManager) => {
      // Get member name
      const org = await entityManager.findOne(Organization, { where: { id: orgId } });
      const memberName = org ? org.name : "Unknown Member";

      const ticket = entityManager.create(SupportTicket, {
        id: `tkt-${Date.now()}`,
        orgId,
        userId,
        moduleKey: dto.moduleKey || null,
        subject: dto.subject,
        description: dto.description,
        status: "open",
        priority: "medium"
      });
      const savedTicket = await entityManager.save(SupportTicket, ticket);

      // Create Admin Alert
      const alert = entityManager.create(Alert, {
        id: `alt-${Date.now()}`,
        title: "تذكرة دعم فني جديدة",
        message: `تذكرة جديدة من "${memberName}" حول موضوع: ${dto.subject}`,
        type: "info",
        read: false
      });
      await entityManager.save(Alert, alert);

      return savedTicket;
    });
  }

  async findAll(orgId?: string): Promise<SupportTicket[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      if (orgId) {
        return entityManager.find(SupportTicket, {
          where: { orgId },
          order: { createdAt: "DESC" }
        });
      }
      return entityManager.find(SupportTicket, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async update(
    ticketId: string,
    status: string,
    reply?: string,
    username?: string
  ): Promise<SupportTicket> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const ticket = await entityManager.findOne(SupportTicket, { where: { id: ticketId } });
      if (!ticket) {
        throw new NotFoundException("Support ticket not found");
      }

      ticket.status = status as any;
      if (reply) {
        ticket.reply = reply;
        ticket.repliedAt = new Date().toISOString();
      }

      const updated = await entityManager.save(SupportTicket, ticket);

      // Log audit
      if (reply && username) {
        const audit = entityManager.create(AuditLog, {
          id: `aud-${Date.now()}`,
          username,
          action: "الرد على تذكرة",
          details: `تم الرد على تذكرة الدعم الفني "${ticket.subject}" للجهة المستعلمة.`,
          ipAddress: null
        });
        await entityManager.save(AuditLog, audit);
      }

      return updated;
    });
  }

  // ❓ Client Questions (Landing Page Contact Form)
  async createQuestion(dto: {
    name: string;
    email: string;
    message: string;
  }): Promise<ClientQuestion> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const question = entityManager.create(ClientQuestion, {
        id: `qst-${Date.now()}`,
        name: dto.name,
        email: dto.email,
        message: dto.message,
        read: false
      });
      return entityManager.save(ClientQuestion, question);
    });
  }

  async findAllQuestions(): Promise<ClientQuestion[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(ClientQuestion, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async replyToQuestion(
    questionId: string,
    replyText: string,
    username: string
  ): Promise<ClientQuestion> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const q = await entityManager.findOne(ClientQuestion, { where: { id: questionId } });
      if (!q) {
        throw new NotFoundException("Client question not found");
      }

      q.reply = replyText;
      q.repliedAt = new Date().toISOString();
      q.read = true;

      const updated = await entityManager.save(ClientQuestion, q);

      // Log audit
      const audit = entityManager.create(AuditLog, {
        id: `aud-${Date.now()}`,
        username,
        action: "الرد على استفسار زبون",
        details: `تم إرسال رد على استفسار الزبون (${q.name}) بريد (${q.email}).`,
        ipAddress: null
      });
      await entityManager.save(AuditLog, audit);

      return updated;
    });
  }

  async markQuestionRead(questionId: string): Promise<ClientQuestion> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const q = await entityManager.findOne(ClientQuestion, { where: { id: questionId } });
      if (!q) {
        throw new NotFoundException("Client question not found");
      }
      q.read = true;
      return entityManager.save(ClientQuestion, q);
    });
  }

  // 🔔 Alerts
  async getAlerts(): Promise<Alert[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(Alert, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async markAlertRead(alertId: string): Promise<Alert> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const alert = await entityManager.findOne(Alert, { where: { id: alertId } });
      if (!alert) {
        throw new NotFoundException("Alert not found");
      }
      alert.read = true;
      return entityManager.save(Alert, alert);
    });
  }

  async markAllAlertsRead(): Promise<void> {
    return this.connectionManager.runPublic(async (entityManager) => {
      await entityManager.update(Alert, {}, { read: true });
    });
  }

  // 📜 Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return this.connectionManager.runPublic(async (entityManager) => {
      return entityManager.find(AuditLog, {
        order: { createdAt: "DESC" }
      });
    });
  }

  async clearAuditLogs(): Promise<void> {
    return this.connectionManager.runPublic(async (entityManager) => {
      await entityManager.delete(AuditLog, {});
    });
  }

  // 📊 Central Sales Statistics
  async getSalesStats(): Promise<any> {
    return this.connectionManager.runPublic(async (entityManager) => {
      const paidInvoices = await entityManager.find(Invoice, { where: { status: "مدفوع" } });
      const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

      const activeOrgs = await entityManager.find(Organization, { where: { status: "نشط" } });
      const monthlyRevenue = activeOrgs.reduce((acc, curr) => acc + curr.monthlyFee, 0);
      const activeSubscriptions = activeOrgs.length;

      const allOrgs = await entityManager.find(Organization);
      const totalMembers = allOrgs.length;
      const suspendedMembers = allOrgs.filter((o) => o.status === "موقوف").length;
      const churnRate = totalMembers > 0 ? Math.round((suspendedMembers / totalMembers) * 100) : 0;

      return {
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions,
        churnRate,
        revenueHistory: [
          { month: "يناير", amount: 120000 },
          { month: "فبراير", amount: 145000 },
          { month: "مارس", amount: 160000 },
          { month: "أبريل", amount: 155000 },
          { month: "مايو", amount: 185000 },
          { month: "يونيو", amount: monthlyRevenue || 290000 }
        ]
      };
    });
  }
}
