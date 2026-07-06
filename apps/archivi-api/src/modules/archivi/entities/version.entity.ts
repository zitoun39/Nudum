import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Document } from "./document.entity";
import { User } from "@nudum/database";

@Entity({ name: "versions" })
export class Version {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "document_id", type: "uuid" })
  documentId!: string;

  @Column({ name: "version_number", type: "integer" })
  versionNumber!: number;

  @Column({ name: "file_key", type: "varchar", length: 500 })
  fileKey!: string;

  @Column({ name: "file_size", type: "integer" })
  fileSize!: number;

  @Column({ name: "mime_type", type: "varchar", length: 100 })
  mimeType!: string;

  @Column({ name: "uploaded_by", type: "varchar", length: 50 })
  uploadedBy!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => Document, (doc) => doc.versions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "document_id" })
  document!: Document;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "uploaded_by" })
  uploadedByUser!: User;
}
