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

@Entity({ name: "invoices", schema: "public" })
export class Invoice {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ name: "org_id", type: "varchar", length: 50 })
  orgId!: string;

  @Column({ name: "member_name", type: "varchar", length: 255 })
  memberName!: string;

  @Column({ name: "invoice_number", type: "varchar", length: 100, unique: true })
  invoiceNumber!: string;

  @Column({ type: "integer" })
  amount!: number;

  @Column({ type: "varchar", length: 10, default: "د.ج" })
  currency!: string;

  @Column({ type: "varchar", length: 50 })
  status!: string; // 'مدفوع' | 'معلق' | 'متأخر'

  @Column({ name: "issued_at", type: "varchar", length: 50 })
  issuedAt!: string;

  @Column({ name: "due_at", type: "varchar", length: 50 })
  dueAt!: string;

  @Column({ name: "paid_at", type: "varchar", length: 50, nullable: true })
  paidAt!: string | null;

  @Column({ name: "receipt_file_id", type: "text", nullable: true })
  receiptFileId!: string | null;

  @Column({ type: "jsonb" })
  items!: any;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "org_id" })
  organization!: Organization;
}
