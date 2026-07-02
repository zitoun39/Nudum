import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantSetup1719921000000 implements MigrationInterface {
  name = "TenantSetup1719921000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create baseline tenant roles & permissions tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id varchar(50) NOT NULL,
        name varchar(100) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT UQ_roles_name UNIQUE (name),
        CONSTRAINT PK_roles_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id varchar(100) NOT NULL,
        name varchar(255) NOT NULL,
        CONSTRAINT PK_permissions_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id varchar(50) NOT NULL,
        permission_id varchar(100) NOT NULL,
        CONSTRAINT PK_role_permissions PRIMARY KEY (role_id, permission_id),
        CONSTRAINT FK_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT FK_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar(50) NOT NULL,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        role_id varchar(50),
        CONSTRAINT PK_users_tenant_id PRIMARY KEY (id),
        CONSTRAINT FK_users_tenant_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );
    `);

    // Seed baseline tenant roles
    await queryRunner.query(`
      INSERT INTO roles (id, name) VALUES
      ('admin', 'Admin'),
      ('operator', 'Operator'),
      ('analyst', 'Lab Analyst')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Create Archivi folders table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        name varchar(100) NOT NULL,
        parent_id uuid,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT PK_folders_id PRIMARY KEY (id),
        CONSTRAINT FK_folders_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
      );
    `);

    // 3. Create Archivi tags table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        name varchar(50) NOT NULL,
        CONSTRAINT UQ_tags_name UNIQUE (name),
        CONSTRAINT PK_tags_id PRIMARY KEY (id)
      );
    `);

    // 4. Create Archivi documents table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        description text,
        folder_id uuid,
        current_version_id uuid,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT PK_documents_id PRIMARY KEY (id),
        CONSTRAINT FK_documents_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
      );
    `);

    // 5. Create Archivi versions table (linking to public schema users table)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS versions (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        document_id uuid NOT NULL,
        version_number integer NOT NULL,
        file_key varchar(500) NOT NULL,
        file_size integer NOT NULL,
        mime_type varchar(100) NOT NULL,
        uploaded_by varchar(50) NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT PK_versions_id PRIMARY KEY (id),
        CONSTRAINT FK_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        CONSTRAINT FK_versions_uploader FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE RESTRICT
      );
    `);

    // 6. Connect documents current_version_id to versions
    await queryRunner.query(`
      ALTER TABLE documents ADD CONSTRAINT FK_documents_current_version 
      FOREIGN KEY (current_version_id) REFERENCES versions(id) ON DELETE SET NULL;
    `);

    // 7. Create Archivi document_tags join table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS document_tags (
        document_id uuid NOT NULL,
        tag_id uuid NOT NULL,
        CONSTRAINT PK_document_tags PRIMARY KEY (document_id, tag_id),
        CONSTRAINT FK_document_tags_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        CONSTRAINT FK_document_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );
    `);

    // 8. Create Archivi correspondences table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS correspondences (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        type varchar(20) NOT NULL,
        reference_number varchar(100) NOT NULL,
        sender varchar(255) NOT NULL,
        recipient varchar(255) NOT NULL,
        subject varchar(255) NOT NULL,
        status varchar(50) NOT NULL DEFAULT 'draft',
        document_id uuid,
        received_sent_at timestamp NOT NULL,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now(),
        CONSTRAINT UQ_correspondences_ref UNIQUE (reference_number),
        CONSTRAINT PK_correspondences_id PRIMARY KEY (id),
        CONSTRAINT FK_correspondences_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS correspondences;`);
    await queryRunner.query(`DROP TABLE IF EXISTS document_tags;`);

    // Remove foreign key before dropping versions
    await queryRunner.query(
      `ALTER TABLE IF EXISTS documents DROP CONSTRAINT IF EXISTS FK_documents_current_version;`
    );

    await queryRunner.query(`DROP TABLE IF EXISTS versions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS documents;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags;`);
    await queryRunner.query(`DROP TABLE IF EXISTS folders;`);

    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);
  }
}
