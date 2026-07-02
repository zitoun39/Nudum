import { Injectable, ConflictException } from "@nestjs/common";
import { TenantConnectionManager } from "../../database/tenant-connection-manager";
import { Tag } from "./entities/tag.entity";
import { CreateTagDto } from "./dto/tags.dto";

@Injectable()
export class TagsService {
  constructor(private readonly connectionManager: TenantConnectionManager) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const existing = await manager.findOne(Tag, { where: { name: dto.name } });
      if (existing) {
        throw new ConflictException(`Tag with name "${dto.name}" already exists`);
      }

      const tag = manager.create(Tag, { name: dto.name });
      return manager.save(Tag, tag);
    });
  }

  async findAll(): Promise<Tag[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      return manager.find(Tag, { order: { name: "ASC" } });
    });
  }
}
