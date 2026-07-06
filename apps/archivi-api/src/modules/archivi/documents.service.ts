import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { StorageService } from "../storage/storage.service";
import { Document } from "./entities/document.entity";
import { Version } from "./entities/version.entity";
import { Tag } from "./entities/tag.entity";
import { Folder } from "./entities/folder.entity";
import { CreateDocumentDto } from "./dto/documents.dto";

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager,
    private readonly storageService: StorageService
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    return this.connectionManager.runInTransaction(async (manager) => {
      let folder: Folder | null = null;
      if (dto.folderId) {
        folder = await manager.findOne(Folder, { where: { id: dto.folderId } });
        if (!folder) {
          throw new NotFoundException(`Folder with ID ${dto.folderId} not found`);
        }
      }

      const tags: Tag[] = [];
      if (dto.tags && dto.tags.length > 0) {
        for (const tagName of dto.tags) {
          let tag = await manager.findOne(Tag, { where: { name: tagName } });
          if (!tag) {
            tag = manager.create(Tag, { name: tagName });
            tag = await manager.save(Tag, tag);
          }
          tags.push(tag);
        }
      }

      const document = manager.create(Document, {
        title: dto.title,
        description: dto.description || null,
        folderId: dto.folderId || null,
        folder,
        tags
      });

      return manager.save(Document, document);
    });
  }

  async uploadVersion(id: string, file: any, userId: string): Promise<Version> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const document = await manager.findOne(Document, { where: { id } });
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      const versionCount = await manager.count(Version, { where: { documentId: id } });
      const versionNumber = versionCount + 1;

      // Cast connection options to access schema property dynamically
      const schemaName = (manager.connection.options as any).schema || "default_tenant";
      const fileKey = `${schemaName}/archivi/${id}/${versionNumber}_${file.originalname}`;

      await this.storageService.uploadFile(fileKey, file.buffer, file.mimetype);

      const version = manager.create(Version, {
        documentId: id,
        document,
        versionNumber,
        fileKey,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId
      });

      const savedVersion = await manager.save(Version, version);

      document.currentVersionId = savedVersion.id;
      document.currentVersion = savedVersion;
      await manager.save(Document, document);

      return savedVersion;
    });
  }

  async getPresignedDownloadUrl(id: string, versionId: string): Promise<string> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const version = await manager.findOne(Version, {
        where: { id: versionId, documentId: id }
      });
      if (!version) {
        throw new NotFoundException(`Version with ID ${versionId} for document ${id} not found`);
      }

      return this.storageService.getDownloadUrl(version.fileKey);
    });
  }

  async findAll(folderId?: string, tagId?: string, search?: string): Promise<Document[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const query = manager
        .createQueryBuilder(Document, "doc")
        .leftJoinAndSelect("doc.folder", "folder")
        .leftJoinAndSelect("doc.currentVersion", "version")
        .leftJoinAndSelect("doc.tags", "tag");

      if (folderId) {
        query.andWhere("doc.folder_id = :folderId", { folderId });
      }

      if (tagId) {
        query.andWhere("tag.id = :tagId", { tagId });
      }

      if (search) {
        query.andWhere("(doc.title ILIKE :search OR doc.description ILIKE :search)", {
          search: `%${search}%`
        });
      }

      return query.orderBy("doc.title", "ASC").getMany();
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const document = await manager.findOne(Document, { where: { id } });
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      await manager.remove(Document, document);
    });
  }
}
