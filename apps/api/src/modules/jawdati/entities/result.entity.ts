import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Analysis } from "./analysis.entity";

@Entity({ name: "results" })
export class Result {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "analysis_id", type: "uuid" })
  analysisId!: string;

  @Column({ name: "parameter_name", type: "varchar", length: 100 })
  parameterName!: string;

  @Column({ type: "numeric", precision: 12, scale: 4 })
  value!: number;

  @Column({ type: "varchar", length: 20 })
  unit!: string;

  @Column({ name: "is_conforming", type: "boolean", default: true })
  isConforming!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => Analysis, (analysis) => analysis.results, { onDelete: "CASCADE" })
  @JoinColumn({ name: "analysis_id" })
  analysis!: Analysis;
}
