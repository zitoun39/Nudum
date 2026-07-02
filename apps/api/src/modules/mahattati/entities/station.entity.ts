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
import { Site } from "./site.entity";
import { Equipment } from "./equipment.entity";
import { Measurement } from "./measurement.entity";

export enum StationStatus {
  ACTIVE = "active",
  MAINTENANCE = "maintenance",
  INACTIVE = "inactive"
}

@Entity({ name: "stations" })
export class Station {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: string;

  @Column({ name: "capacity_m3_day", type: "numeric", precision: 12, scale: 2, nullable: true })
  capacityM3Day!: number | null;

  @Column({ type: "enum", enum: StationStatus, default: StationStatus.ACTIVE })
  status!: StationStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @ManyToOne(() => Site, (site) => site.stations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "site_id" })
  site!: Site;

  @OneToMany(() => Equipment, (equipment) => equipment.station)
  equipment!: Equipment[];

  @OneToMany(() => Measurement, (measurement) => measurement.station)
  measurements!: Measurement[];
}
