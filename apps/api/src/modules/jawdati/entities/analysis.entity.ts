import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Sample } from "./sample.entity";
import { Result } from "./result.entity";

export enum AnalysisStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

@Entity({ name: "analyses" })
export class Analysis {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "sample_id", type: "uuid" })
  sampleId!: string;

  @Column({ name: "test_method", type: "varchar", length: 100 })
  testMethod!: string;

  @Column({ type: "enum", enum: AnalysisStatus, default: AnalysisStatus.PENDING })
  status!: AnalysisStatus;

  @Column({ name: "analyst_id", type: "uuid" })
  analystId!: string;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  startedAt!: Date | null;

  @Column({ name: "completed_at", type: "timestamp", nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => Sample, (sample) => sample.analyses, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sample_id" })
  sample!: Sample;

  @OneToMany(() => Result, (result) => result.analysis)
  results!: Result[];
}
