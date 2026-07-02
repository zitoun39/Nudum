import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "../../database/tenant-connection-manager";
import { Station } from "./entities/station.entity";
import { Equipment } from "./entities/equipment.entity";
import { Measurement } from "./entities/measurement.entity";
import { CreateMeasurementDto } from "./dto/measurements.dto";

@Injectable()
export class MeasurementsService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateMeasurementDto): Promise<Measurement> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const station = await manager.findOne(Station, { where: { id: dto.stationId } });
      if (!station) {
        throw new NotFoundException(`Station with ID ${dto.stationId} not found`);
      }

      let equipment: Equipment | null = null;
      if (dto.equipmentId) {
        equipment = await manager.findOne(Equipment, {
          where: { id: dto.equipmentId, stationId: dto.stationId }
        });
        if (!equipment) {
          throw new NotFoundException(
            `Equipment with ID ${dto.equipmentId} not found at this station`
          );
        }
      }

      const measurement = manager.create(Measurement, {
        stationId: dto.stationId,
        equipmentId: dto.equipmentId || null,
        parameterName: dto.parameterName,
        value: dto.value,
        unit: dto.unit,
        loggedBy: dto.loggedBy,
        loggedAt: dto.loggedAt ? new Date(dto.loggedAt) : undefined,
        station,
        equipment
      });

      return manager.save(Measurement, measurement);
    });
  }

  async findAll(
    stationId?: string,
    equipmentId?: string,
    parameterName?: string
  ): Promise<Measurement[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const query = manager
        .createQueryBuilder(Measurement, "meas")
        .leftJoinAndSelect("meas.station", "station")
        .leftJoinAndSelect("meas.equipment", "equipment");

      if (stationId) {
        query.andWhere("meas.station_id = :stationId", { stationId });
      }

      if (equipmentId) {
        query.andWhere("meas.equipment_id = :equipmentId", { equipmentId });
      }

      if (parameterName) {
        query.andWhere("meas.parameter_name = :parameterName", { parameterName });
      }

      return query.orderBy("meas.logged_at", "DESC").getMany();
    });
  }

  async findOne(id: string): Promise<Measurement> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const measurement = await manager.findOne(Measurement, {
        where: { id },
        relations: ["station", "equipment"]
      });
      if (!measurement) {
        throw new NotFoundException(`Measurement with ID ${id} not found`);
      }
      return measurement;
    });
  }
}
