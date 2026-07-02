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
import { Station } from "./station.entity";
import { Measurement } from "./measurement.entity";

export enum EquipmentStatus {
  OPERATIONAL = "operational",
  FAULTY = "faulty",
  UNDER_MAINTENANCE = "under_maintenance",
  DECOMMISSIONED = "decommissioned"
}

@Entity({ name: "equipment" })
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ name: "serial_number", type: "varchar", length: 100, nullable: true })
  serialNumber!: string | null;

  @Column({ name: "station_id", type: "uuid" })
  stationId!: string;

  @Column({ type: "varchar", length: 100 })
  type!: string;

  @Column({ name: "installed_at", type: "date", nullable: true })
  installedAt!: Date | null;

  @Column({ type: "enum", enum: EquipmentStatus, default: EquipmentStatus.OPERATIONAL })
  status!: EquipmentStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Station, (station) => station.equipment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "station_id" })
  station!: Station;

  @OneToMany(() => Measurement, (measurement) => measurement.equipment)
  measurements!: Measurement[];
}
