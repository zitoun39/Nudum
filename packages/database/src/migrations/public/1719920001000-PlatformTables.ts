import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class PlatformTables1719920001000 implements MigrationInterface {
  name = "PlatformTables1719920001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create module_subscriptions table in public schema
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.module_subscriptions (
        id VARCHAR(50) NOT NULL,
        org_id VARCHAR(50) NOT NULL,
        module_key VARCHAR(50) NOT NULL,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        activated_at TIMESTAMP NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_module_subscriptions_id PRIMARY KEY (id),
        CONSTRAINT FK_module_subscriptions_org_id FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
      );
    `);

    // 2. Create support_tickets table in public schema
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.support_tickets (
        id VARCHAR(50) NOT NULL,
        org_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        module_key VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_support_tickets_id PRIMARY KEY (id),
        CONSTRAINT FK_support_tickets_org_id FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE,
        CONSTRAINT FK_support_tickets_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      );
    `);

    // 3. Seed Organizations
    await queryRunner.query(`
      INSERT INTO public.organizations (id, name, schema_name) VALUES
      ('ade_oran', 'مؤسسة المياه الجزائرية - وهران (ADE Oran)', 'tenant_ade_oran'),
      ('seaal_algiers', 'مؤسسة سيال الجزائر العاصمة (SEAAL Algiers)', 'tenant_seaal_algiers'),
      ('ade_general', 'مؤسسة الجزائرية للمياه (ADE General)', 'tenant_ade_general')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 4. Hash password dynamically and seed default admin user
    const passwordHash = await bcrypt.hash("admin123", 10);
    await queryRunner.query(`
      INSERT INTO public.users (id, email, password_hash, organization_id, is_platform_admin) VALUES
      ('usr-admin', 'admin@nudum.dz', '${passwordHash}', 'ade_oran', true)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 5. Seed module subscriptions for Oran regional lab
    await queryRunner.query(`
      INSERT INTO public.module_subscriptions (id, org_id, module_key, plan, status, activated_at, expires_at) VALUES
      ('sub-oran-1', 'ade_oran', 'mahattati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-oran-2', 'ade_oran', 'jawdati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-oran-3', 'ade_oran', 'archivi', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-algiers-1', 'seaal_algiers', 'mahattati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-algiers-2', 'seaal_algiers', 'jawdati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-algiers-3', 'seaal_algiers', 'archivi', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-general-1', 'ade_general', 'mahattati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-general-2', 'ade_general', 'jawdati', 'premium', 'active', now(), now() + interval '1 year'),
      ('sub-general-3', 'ade_general', 'archivi', 'premium', 'active', now(), now() + interval '1 year')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.support_tickets;`);
    await queryRunner.query(`DROP TABLE IF EXISTS public.module_subscriptions;`);
  }
}
