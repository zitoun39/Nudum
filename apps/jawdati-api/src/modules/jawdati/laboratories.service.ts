import { Injectable, ConflictException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { CreateLaboratoryDto, UpdateLaboratoryDto } from "./dto/laboratories.dto";
import { Laboratory } from "./entities/laboratory.entity";

@Injectable()
export class LaboratoriesService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateLaboratoryDto): Promise<Laboratory> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const existing = await entityManager.findOne(Laboratory, { where: { name: dto.name } });
      if (existing) {
        throw new ConflictException(`Laboratory with name "${dto.name}" already exists`);
      }

      const lab = entityManager.create(Laboratory, {
        name: dto.name,
        location: dto.location || null
      });

      return entityManager.save(Laboratory, lab);
    });
  }

  async findAll(): Promise<Laboratory[]> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      return entityManager.find(Laboratory, { order: { name: "ASC" } });
    });
  }

  async findOne(id: string): Promise<Laboratory> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const lab = await entityManager.findOne(Laboratory, { where: { id } });
      if (!lab) {
        throw new NotFoundException(`Laboratory with ID "${id}" not found`);
      }
      return lab;
    });
  }

  async update(id: string, dto: UpdateLaboratoryDto): Promise<Laboratory> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const lab = await this.findOne(id);

      if (dto.name && dto.name !== lab.name) {
        const existing = await entityManager.findOne(Laboratory, { where: { name: dto.name } });
        if (existing) {
          throw new ConflictException(`Laboratory with name "${dto.name}" already exists`);
        }
        lab.name = dto.name;
      }

      if (dto.location !== undefined) {
        lab.location = dto.location;
      }

      return entityManager.save(Laboratory, lab);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const lab = await this.findOne(id);
      await entityManager.remove(Laboratory, lab);
    });
  }
}
