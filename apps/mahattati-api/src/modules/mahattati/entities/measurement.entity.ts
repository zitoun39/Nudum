import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Station } from "./station.entity";
import { Equipment } from "./equipment.entity";

@Entity({ name: "measurements" })
export class Measurement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "station_id", type: "uuid" })
  stationId!: string;

  @Column({ name: "equipment_id", type: "uuid", nullable: true })
  equipmentId!: string | null;

  @Column({ name: "parameter_name", type: "varchar", length: 100 })
  parameterName!: string;

  @Column({ type: "numeric", precision: 12, scale: 4 })
  value!: number;

  @Column({ type: "varchar", length: 20 })
  unit!: string;

  @Column({ name: "logged_by", type: "uuid" })
  loggedBy!: string;

  @Column({ name: "logged_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  loggedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ManyToOne(() => Station, (station) => station.measurements, { onDelete: "CASCADE" })
  @JoinColumn({ name: "station_id" })
  station!: Station;

  @ManyToOne(() => Equipment, (equipment) => equipment.measurements, {
    onDelete: "SET NULL",
    nullable: true
  })
  @JoinColumn({ name: "equipment_id" })
  equipment!: Equipment | null;
}
