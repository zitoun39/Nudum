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

@Entity({ name: "subscription_requests", schema: "public" })
export class SubscriptionRequest {
  @PrimaryColumn({ type: "varchar", length: 50 })
  id!: string;

  @Column({ name: "org_id", type: "varchar", length: 50 })
  orgId!: string;

  @Column({ name: "member_name", type: "varchar", length: 255 })
  memberName!: string;

  @Column({ type: "varchar", length: 100 })
  type!: string; // 'registration' | 'upgrade' | 'downgrade' | 'service_activation' | 'service_deactivation'

  @Column({ name: "current_plan", type: "varchar", length: 50, nullable: true })
  currentPlan!: string | null;

  @Column({ name: "requested_plan", type: "varchar", length: 50, nullable: true })
  requestedPlan!: string | null;

  @Column({ name: "requested_services", type: "jsonb", nullable: true })
  requestedServices!: any;

  @Column({ type: "text", nullable: true })
  message!: string | null;

  @Column({ type: "varchar", length: 50, default: "معلق" })
  status!: string; // 'معلق' | 'مقبول' | 'مرفوض'

  @Column({ name: "resolved_at", type: "varchar", length: 100, nullable: true })
  resolvedAt!: string | null;

  @Column({ name: "resolved_by", type: "varchar", length: 100, nullable: true })
  resolvedBy!: string | null;

  @Column({ name: "rejection_reason", type: "text", nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "org_id" })
  organization!: Organization;
}
