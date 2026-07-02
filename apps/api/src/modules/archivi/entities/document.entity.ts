import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Folder } from "./folder.entity";
import { Version } from "./version.entity";
import { Tag } from "./tag.entity";

@Entity({ name: "documents" })
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "folder_id", type: "uuid", nullable: true })
  folderId!: string | null;

  @Column({ name: "current_version_id", type: "uuid", nullable: true })
  currentVersionId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Folder, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "folder_id" })
  folder!: Folder | null;

  @OneToMany(() => Version, (version) => version.document)
  versions!: Version[];

  @OneToOne(() => Version, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "current_version_id" })
  currentVersion!: Version | null;

  @ManyToMany(() => Tag, (tag) => tag.documents)
  @JoinTable({
    name: "document_tags",
    joinColumn: { name: "document_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" }
  })
  tags!: Tag[];
}
