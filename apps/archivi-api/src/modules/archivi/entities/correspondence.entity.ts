import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import { Document } from "./document.entity";

export enum CorrespondenceType {
  INCOMING = "incoming",
  OUTGOING = "outgoing"
}

export enum CorrespondenceStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected"
}

@Entity({ name: "correspondences" })
export class Correspondence {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: CorrespondenceType })
  type!: CorrespondenceType;

  @Column({ name: "reference_number", type: "varchar", length: 100, unique: true })
  referenceNumber!: string;

  @Column({ type: "varchar", length: 255 })
  sender!: string;

  @Column({ type: "varchar", length: 255 })
  recipient!: string;

  @Column({ type: "varchar", length: 255 })
  subject!: string;

  @Column({ type: "enum", enum: CorrespondenceStatus, default: CorrespondenceStatus.DRAFT })
  status!: CorrespondenceStatus;

  @Column({ name: "document_id", type: "uuid", nullable: true })
  documentId!: string | null;

  @Column({ name: "received_sent_at", type: "timestamp" })
  receivedSentAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @OneToOne(() => Document, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "document_id" })
  document!: Document | null;
}
