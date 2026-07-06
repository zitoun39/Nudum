import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "module_subscriptions", schema: "public" })
export class ModuleSubscription {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ name: "org_id", type: "varchar", length: 50 })
  orgId!: string;

  @Column({ name: "module_key", type: "varchar", length: 50 })
  moduleKey!: "mahattati" | "jawdati" | "archivi";

  @Column({ type: "varchar", length: 50 })
  plan!: string; // 'basic' | 'standard' | 'premium'

  @Column({ type: "varchar", length: 50, default: "active" })
  status!: "active" | "trial" | "suspended" | "expired";

  @Column({ name: "activated_at", type: "timestamp" })
  activatedAt!: Date;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
