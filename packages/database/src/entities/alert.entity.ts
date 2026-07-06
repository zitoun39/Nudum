import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "alerts", schema: "public" })
export class Alert {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", length: 50 })
  type!: string; // 'info' | 'success' | 'warning' | 'danger'

  @Column({ name: "is_read", type: "boolean", default: false })
  read!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
