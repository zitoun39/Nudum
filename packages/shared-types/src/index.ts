export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: string;
  organizationId: string | null;
  isPlatformAdmin: boolean;
}

export interface SupportTicketDto {
  subject: string;
  description: string;
  moduleKey?: string;
}
