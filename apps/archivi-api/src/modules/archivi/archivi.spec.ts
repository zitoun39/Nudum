import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FoldersService } from "./folders.service";
import { TagsService } from "./tags.service";
import { DocumentsService } from "./documents.service";
import { CorrespondencesService } from "./correspondences.service";
import { TenantConnectionManager } from "@nudum/database";
import { StorageService } from "../storage/storage.service";
import { CorrespondenceStatus, CorrespondenceType } from "./entities/correspondence.entity";

describe("Archivi Services Unit Tests", () => {
  let foldersService: FoldersService;
  let tagsService: TagsService;
  let documentsService: DocumentsService;
  let correspondencesService: CorrespondencesService;

  const mockEntityManager = {
    create: vi.fn((_entity, data) => data),
    save: vi.fn((_entity, data) => Promise.resolve({ id: "mock-id", ...data })),
    findOne: vi.fn(),
    find: vi.fn(),
    count: vi.fn(),
    connection: {
      options: {
        schema: "tenant_test"
      }
    },
    createQueryBuilder: vi.fn(() => ({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([])
    }))
  };

  const mockConnectionManager = {
    runInTransaction: vi.fn((callback) => callback(mockEntityManager))
  };

  const mockStorageService = {
    uploadFile: vi.fn().mockResolvedValue("mock-key"),
    getDownloadUrl: vi.fn().mockResolvedValue("http://mock-presigned-url")
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoldersService,
        TagsService,
        DocumentsService,
        CorrespondencesService,
        { provide: TenantConnectionManager, useValue: mockConnectionManager },
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).compile();

    foldersService = module.get<FoldersService>(FoldersService);
    tagsService = module.get<TagsService>(TagsService);
    documentsService = module.get<DocumentsService>(DocumentsService);
    correspondencesService = module.get<CorrespondencesService>(CorrespondencesService);
  });

  describe("FoldersService", () => {
    it("should create a folder", async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      const result = await foldersService.create({ name: "Invoices" });
      expect(result.name).toBe("Invoices");
      expect(mockConnectionManager.runInTransaction).toHaveBeenCalled();
    });
  });

  describe("TagsService", () => {
    it("should create a tag", async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      const result = await tagsService.create({ name: "Finance" });
      expect(result.name).toBe("Finance");
    });
  });

  describe("DocumentsService", () => {
    it("should create a document container", async () => {
      mockEntityManager.findOne.mockResolvedValueOnce({ id: "folder-uuid", name: "Invoices" });
      const result = await documentsService.create({
        title: "Report.pdf",
        folderId: "folder-uuid"
      });
      expect(result.title).toBe("Report.pdf");
    });
  });

  describe("CorrespondencesService", () => {
    it("should log a new correspondence letter", async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      const result = await correspondencesService.create({
        type: CorrespondenceType.INCOMING,
        referenceNumber: "REF-9999",
        sender: "Ministry",
        recipient: "CEO Office",
        subject: "Budget Approval",
        receivedSentAt: new Date().toISOString()
      });

      expect(result.referenceNumber).toBe("REF-9999");
      expect(result.status).toBe(CorrespondenceStatus.DRAFT);
    });
  });
});
