import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { Folder } from "./entities/folder.entity";
import { CreateFolderDto } from "./dto/folders.dto";
import { Document } from "./entities/document.entity";

@Injectable()
export class FoldersService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateFolderDto): Promise<Folder> {
    return this.connectionManager.runInTransaction(async (manager) => {
      let parent: Folder | null = null;
      if (dto.parentId) {
        parent = await manager.findOne(Folder, { where: { id: dto.parentId } });
        if (!parent) {
          throw new NotFoundException(`Parent folder with ID ${dto.parentId} not found`);
        }
      }

      const folder = manager.create(Folder, {
        name: dto.name,
        parentId: dto.parentId || null,
        parent
      });

      return manager.save(Folder, folder);
    });
  }

  async findAll(): Promise<Folder[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      return manager.find(Folder, { order: { name: "ASC" } });
    });
  }

  async findOne(id: string): Promise<Folder> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const folder = await manager.findOne(Folder, { where: { id } });
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }
      return folder;
    });
  }

  async update(id: string, name: string): Promise<Folder> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const folder = await manager.findOne(Folder, { where: { id } });
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }
      folder.name = name;
      return manager.save(Folder, folder);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const folder = await manager.findOne(Folder, { where: { id } });
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }

      // Check if folder contains child folders
      const childCount = await manager.count(Folder, { where: { parentId: id } });
      if (childCount > 0) {
        throw new BadRequestException("Cannot delete folder because it contains nested folders");
      }

      // Check if folder contains documents
      const docCount = await manager.count(Document, { where: { folderId: id } });
      if (docCount > 0) {
        throw new BadRequestException("Cannot delete folder because it contains documents");
      }

      await manager.remove(Folder, folder);
    });
  }
}
