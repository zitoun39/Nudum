import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "support_tickets", schema: "public" })
export class SupportTicket {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ name: "org_id", type: "varchar", length: 50 })
  orgId!: string;

  @Column({ name: "user_id", type: "varchar", length: 50 })
  userId!: string;

  @Column({ name: "module_key", type: "varchar", length: 50, nullable: true })
  moduleKey!: string | null;

  @Column({ type: "varchar", length: 255 })
  subject!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 50, default: "open" })
  status!: "open" | "in_progress" | "resolved" | "closed";

  @Column({ type: "varchar", length: 50, default: "medium" })
  priority!: "low" | "medium" | "high" | "urgent";

  @Column({ type: "text", nullable: true })
  reply!: string | null;

  @Column({ name: "replied_at", type: "varchar", length: 100, nullable: true })
  repliedAt!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
