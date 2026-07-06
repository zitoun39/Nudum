import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Organization } from "./organization.entity";

@Entity({ name: "users", schema: "public" })
export class User {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ name: "organization_id", type: "varchar", length: 50, nullable: true })
  organizationId!: string | null;

  @Column({ name: "is_platform_admin", type: "boolean", default: false })
  isPlatformAdmin!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  name!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  username!: string | null;

  @Column({ type: "varchar", length: 50, default: "client" })
  role!: string;

  @Column({ name: "last_login", type: "varchar", length: 100, nullable: true })
  lastLogin!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Organization, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "organization_id" })
  organization!: Organization | null;
}
