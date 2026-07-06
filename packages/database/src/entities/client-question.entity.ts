import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "client_questions", schema: "public" })
export class ClientQuestion {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ name: "is_read", type: "boolean", default: false })
  read!: boolean;

  @Column({ type: "text", nullable: true })
  reply!: string | null;

  @Column({ name: "replied_at", type: "varchar", length: 100, nullable: true })
  repliedAt!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
