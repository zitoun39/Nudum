import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { Site } from "./entities/site.entity";
import { Station } from "./entities/station.entity";
import { Equipment } from "./entities/equipment.entity";
import { CreateStationDto, UpdateStationDto } from "./dto/stations.dto";

@Injectable()
export class StationsService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateStationDto): Promise<Station> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const site = await manager.findOne(Site, { where: { id: dto.siteId } });
      if (!site) {
        throw new NotFoundException(`Site with ID ${dto.siteId} not found`);
      }

      const existing = await manager.findOne(Station, {
        where: { name: dto.name, siteId: dto.siteId }
      });
      if (existing) {
        throw new BadRequestException(
          `Station with name "${dto.name}" already exists at this site`
        );
      }

      const station = manager.create(Station, {
        name: dto.name,
        siteId: dto.siteId,
        capacityM3Day: dto.capacityM3Day || null,
        status: dto.status || undefined,
        site
      });

      return manager.save(Station, station);
    });
  }

  async findAll(siteId?: string): Promise<Station[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const where: any = {};
      if (siteId) {
        where.siteId = siteId;
      }
      return manager.find(Station, { where, order: { name: "ASC" } });
    });
  }

  async findOne(id: string): Promise<Station> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const station = await manager.findOne(Station, {
        where: { id },
        relations: ["site", "equipment"]
      });
      if (!station) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }
      return station;
    });
  }

  async update(id: string, dto: UpdateStationDto): Promise<Station> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const station = await manager.findOne(Station, { where: { id } });
      if (!station) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }

      if (dto.name) {
        const existing = await manager.findOne(Station, {
          where: { name: dto.name, siteId: station.siteId }
        });
        if (existing && existing.id !== id) {
          throw new BadRequestException(
            `Station with name "${dto.name}" already exists at this site`
          );
        }
        station.name = dto.name;
      }

      if (dto.capacityM3Day !== undefined) {
        station.capacityM3Day = dto.capacityM3Day;
      }

      if (dto.status) {
        station.status = dto.status;
      }

      return manager.save(Station, station);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const station = await manager.findOne(Station, { where: { id } });
      if (!station) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }

      const equipCount = await manager.count(Equipment, { where: { stationId: id } });
      if (equipCount > 0) {
        throw new BadRequestException(
          "Cannot delete station because it contains registered equipment"
        );
      }

      await manager.remove(Station, station);
    });
  }
}
