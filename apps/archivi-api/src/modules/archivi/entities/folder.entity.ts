import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";

@Entity({ name: "folders" })
export class Folder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Folder, (folder) => folder.children, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "parent_id" })
  parent!: Folder | null;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children!: Folder[];
}
