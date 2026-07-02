import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Document } from "./document.entity";

@Entity({ name: "tags" })
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  name!: string;

  @ManyToMany(() => Document, (doc) => doc.tags)
  documents!: Document[];
}
