import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "audit_logs", schema: "public" })
export class AuditLog {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  action!: string;

  @Column({ type: "text" })
  details!: string;

  @Column({ name: "ip_address", type: "varchar", length: 50, nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
