import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "organizations", schema: "public" })
export class Organization {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ name: "schema_name", type: "varchar", length: 100, unique: true })
  schemaName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  contact!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 50, default: "Starter" })
  plan!: string;

  @Column({ type: "varchar", length: 50, default: "بانتظار التفعيل" })
  status!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  renewal!: string | null;

  @Column({ name: "joined_at", type: "varchar", length: 50, nullable: true })
  joinedAt!: string | null;

  @Column({ name: "monthly_fee", type: "integer", default: 0 })
  monthlyFee!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
