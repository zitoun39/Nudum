import { MigrationInterface, QueryRunner } from "typeorm";

export class PlatformRemediation1719920002000 implements MigrationInterface {
  name = "PlatformRemediation1719920002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Alter organizations table to add SAAS columns
    await queryRunner.query(`
      ALTER TABLE public.organizations 
      ADD COLUMN IF NOT EXISTS contact VARCHAR(255),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS plan VARCHAR(50) NOT NULL DEFAULT 'Starter',
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'بانتظار التفعيل',
      ADD COLUMN IF NOT EXISTS renewal VARCHAR(50),
      ADD COLUMN IF NOT EXISTS joined_at VARCHAR(50),
      ADD COLUMN IF NOT EXISTS monthly_fee INT NOT NULL DEFAULT 0;
    `);

    // 2. Alter users table to add profile columns
    await queryRunner.query(`
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS username VARCHAR(255),
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'client',
      ADD COLUMN IF NOT EXISTS last_login VARCHAR(100);
    `);

    // 3. Create invoices table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.invoices (
        id VARCHAR(50) NOT NULL,
        org_id VARCHAR(50) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(100) NOT NULL UNIQUE,
        amount INT NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'د.ج',
        status VARCHAR(50) NOT NULL,
        issued_at VARCHAR(50) NOT NULL,
        due_at VARCHAR(50) NOT NULL,
        paid_at VARCHAR(50),
        receipt_file_id TEXT,
        items JSONB NOT NULL,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_invoices_id PRIMARY KEY (id),
        CONSTRAINT FK_invoices_org_id FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
      );
    `);

    // 4. Create subscription_requests table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.subscription_requests (
        id VARCHAR(50) NOT NULL,
        org_id VARCHAR(50) NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        current_plan VARCHAR(50),
        requested_plan VARCHAR(50),
        requested_services JSONB,
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'معلق',
        resolved_at VARCHAR(100),
        resolved_by VARCHAR(100),
        rejection_reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_subscription_requests_id PRIMARY KEY (id),
        CONSTRAINT FK_subscription_requests_org_id FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
      );
    `);

    // 5. Create client_questions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.client_questions (
        id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        reply TEXT,
        replied_at VARCHAR(100),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_client_questions_id PRIMARY KEY (id)
      );
    `);

    // 6. Create alerts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.alerts (
        id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_alerts_id PRIMARY KEY (id)
      );
    `);

    // 7. Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id VARCHAR(50) NOT NULL,
        username VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        ip_address VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_audit_logs_id PRIMARY KEY (id)
      );
    `);

    // 8. Alter support_tickets table to add reply fields
    await queryRunner.query(`
      ALTER TABLE public.support_tickets
      ADD COLUMN IF NOT EXISTS reply TEXT,
      ADD COLUMN IF NOT EXISTS replied_at VARCHAR(100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.audit_logs;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.alerts;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.client_questions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.subscription_requests;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.invoices;`);
  }
}
