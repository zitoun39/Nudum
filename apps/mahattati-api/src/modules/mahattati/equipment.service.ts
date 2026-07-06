import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { Station } from "./entities/station.entity";
import { Equipment } from "./entities/equipment.entity";
import { CreateEquipmentDto, UpdateEquipmentDto } from "./dto/equipment.dto";

@Injectable()
export class EquipmentService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateEquipmentDto): Promise<Equipment> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const station = await manager.findOne(Station, { where: { id: dto.stationId } });
      if (!station) {
        throw new NotFoundException(`Station with ID ${dto.stationId} not found`);
      }

      if (dto.serialNumber) {
        const existing = await manager.findOne(Equipment, {
          where: { serialNumber: dto.serialNumber, stationId: dto.stationId }
        });
        if (existing) {
          throw new BadRequestException(
            `Equipment with serial number "${dto.serialNumber}" already exists at this station`
          );
        }
      }

      const equipment = manager.create(Equipment, {
        name: dto.name,
        serialNumber: dto.serialNumber || null,
        stationId: dto.stationId,
        type: dto.type,
        installedAt: dto.installedAt ? new Date(dto.installedAt) : null,
        status: dto.status || undefined,
        station
      });

      return manager.save(Equipment, equipment);
    });
  }

  async findAll(stationId?: string): Promise<Equipment[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const where: any = {};
      if (stationId) {
        where.stationId = stationId;
      }
      return manager.find(Equipment, { where, order: { name: "ASC" } });
    });
  }

  async findOne(id: string): Promise<Equipment> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const equipment = await manager.findOne(Equipment, {
        where: { id },
        relations: ["station", "station.site"]
      });
      if (!equipment) {
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }
      return equipment;
    });
  }

  async update(id: string, dto: UpdateEquipmentDto): Promise<Equipment> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const equipment = await manager.findOne(Equipment, { where: { id } });
      if (!equipment) {
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }

      if (dto.name) {
        equipment.name = dto.name;
      }

      if (dto.serialNumber !== undefined) {
        if (dto.serialNumber) {
          const existing = await manager.findOne(Equipment, {
            where: { serialNumber: dto.serialNumber, stationId: equipment.stationId }
          });
          if (existing && existing.id !== id) {
            throw new BadRequestException(
              `Equipment with serial number "${dto.serialNumber}" already exists at this station`
            );
          }
        }
        equipment.serialNumber = dto.serialNumber || null;
      }

      if (dto.type) {
        equipment.type = dto.type;
      }

      if (dto.installedAt !== undefined) {
        equipment.installedAt = dto.installedAt ? new Date(dto.installedAt) : null;
      }

      if (dto.status) {
        equipment.status = dto.status;
      }

      return manager.save(Equipment, equipment);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const equipment = await manager.findOne(Equipment, { where: { id } });
      if (!equipment) {
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }

      await manager.remove(Equipment, equipment);
    });
  }
}
