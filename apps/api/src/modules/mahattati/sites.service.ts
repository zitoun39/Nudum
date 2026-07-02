import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "../../database/tenant-connection-manager";
import { Site } from "./entities/site.entity";
import { Station } from "./entities/station.entity";
import { CreateSiteDto, UpdateSiteDto } from "./dto/sites.dto";

@Injectable()
export class SitesService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateSiteDto): Promise<Site> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const existing = await manager.findOne(Site, { where: { name: dto.name } });
      if (existing) {
        throw new BadRequestException(`Site with name "${dto.name}" already exists`);
      }

      const site = manager.create(Site, {
        name: dto.name,
        location: dto.location || null
      });

      return manager.save(Site, site);
    });
  }

  async findAll(): Promise<Site[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      return manager.find(Site, { order: { name: "ASC" } });
    });
  }

  async findOne(id: string): Promise<Site> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const site = await manager.findOne(Site, { where: { id }, relations: ["stations"] });
      if (!site) {
        throw new NotFoundException(`Site with ID ${id} not found`);
      }
      return site;
    });
  }

  async update(id: string, dto: UpdateSiteDto): Promise<Site> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const site = await manager.findOne(Site, { where: { id } });
      if (!site) {
        throw new NotFoundException(`Site with ID ${id} not found`);
      }

      if (dto.name) {
        const existing = await manager.findOne(Site, { where: { name: dto.name } });
        if (existing && existing.id !== id) {
          throw new BadRequestException(`Site with name "${dto.name}" already exists`);
        }
        site.name = dto.name;
      }

      if (dto.location !== undefined) {
        site.location = dto.location || null;
      }

      return manager.save(Site, site);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const site = await manager.findOne(Site, { where: { id } });
      if (!site) {
        throw new NotFoundException(`Site with ID ${id} not found`);
      }

      const stationCount = await manager.count(Station, { where: { siteId: id } });
      if (stationCount > 0) {
        throw new BadRequestException("Cannot delete site because it contains stations");
      }

      await manager.remove(Site, site);
    });
  }
}
