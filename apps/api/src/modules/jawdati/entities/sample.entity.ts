import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Laboratory } from "./laboratory.entity";
import { Analysis } from "./analysis.entity";

export enum SampleStatus {
  COLLECTED = "collected",
  RECEIVED = "received",
  ANALYZING = "analyzing",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

@Entity({ name: "samples" })
export class Sample {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "sample_code", type: "varchar", length: 50 })
  sampleCode!: string;

  @Column({ name: "laboratory_id", type: "uuid" })
  laboratoryId!: string;

  @Column({ name: "collected_at", type: "timestamp" })
  collectedAt!: Date;

  @Column({ name: "collected_by", type: "varchar", length: 100 })
  collectedBy!: string;

  @Column({ name: "source_site_id", type: "uuid", nullable: true })
  sourceSiteId!: string | null;

  @Column({ name: "source_station_id", type: "uuid", nullable: true })
  sourceStationId!: string | null;

  @Column({ type: "enum", enum: SampleStatus, default: SampleStatus.COLLECTED })
  status!: SampleStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Laboratory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "laboratory_id" })
  laboratory!: Laboratory;

  @OneToMany(() => Analysis, (analysis) => analysis.sample)
  analyses!: Analysis[];
}
