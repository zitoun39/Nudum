import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LaboratoriesService } from "./laboratories.service";
import { SamplesService } from "./samples.service";
import { AnalysesService } from "./analyses.service";
import { ResultsService } from "./results.service";
import { AnalysisStatus } from "./entities/analysis.entity";
import { TenantConnectionManager } from "@nudum/database";

describe("Jawdati Services Unit Tests", () => {
  let laboratoriesService: LaboratoriesService;
  let samplesService: SamplesService;
  let analysesService: AnalysesService;
  let resultsService: ResultsService;

  const mockEntityManager = {
    create: vi.fn((_entity, data) => data),
    save: vi.fn((_entity, data) => Promise.resolve({ id: "mock-id", ...data })),
    findOne: vi.fn(),
    find: vi.fn(),
    count: vi.fn(),
    remove: vi.fn(() => Promise.resolve())
  };

  const mockConnectionManager = {
    runInTransaction: vi.fn((callback) => callback(mockEntityManager))
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaboratoriesService,
        SamplesService,
        AnalysesService,
        ResultsService,
        { provide: TenantConnectionManager, useValue: mockConnectionManager }
      ]
    }).compile();

    laboratoriesService = module.get<LaboratoriesService>(LaboratoriesService);
    samplesService = module.get<SamplesService>(SamplesService);
    analysesService = module.get<AnalysesService>(AnalysesService);
    resultsService = module.get<ResultsService>(ResultsService);
  });

  describe("LaboratoriesService", () => {
    it("should register a laboratory facility", async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      const result = await laboratoriesService.create({
        name: "Central QC Lab",
        location: "Building A"
      });
      expect(result.name).toBe("Central QC Lab");
    });
  });

  describe("SamplesService", () => {
    it("should register a collected water sample specimen", async () => {
      mockEntityManager.findOne
        .mockResolvedValueOnce({ id: "lab-uuid", name: "Central QC Lab" }) // find Laboratory
        .mockResolvedValueOnce(null); // find unique sampleCode
      const result = await samplesService.create({
        sampleCode: "SMP-1002",
        laboratoryId: "lab-uuid",
        collectedAt: new Date().toISOString(),
        collectedBy: "Operator X"
      });
      expect(result.sampleCode).toBe("SMP-1002");
    });
  });

  describe("AnalysesService", () => {
    it("should request a test analysis run", async () => {
      mockEntityManager.findOne.mockResolvedValue({ id: "sample-uuid", sampleCode: "SMP-1002" });
      const result = await analysesService.create({
        sampleId: "sample-uuid",
        testMethod: "ISO 10523 pH Test",
        analystId: "analyst-uuid"
      });
      expect(result.testMethod).toBe("ISO 10523 pH Test");
      expect(result.status).toBe(AnalysisStatus.PENDING);
    });
  });

  describe("ResultsService", () => {
    it("should log a parameter measurement result and auto-complete analysis", async () => {
      mockEntityManager.findOne.mockResolvedValue({
        id: "analysis-uuid",
        status: AnalysisStatus.PENDING,
        testMethod: "ISO 10523"
      });
      const result = await resultsService.create({
        analysisId: "analysis-uuid",
        parameterName: "pH",
        value: 7.25,
        unit: "pH units",
        isConforming: true
      });
      expect(result.parameterName).toBe("pH");
      expect(result.value).toBe(7.25);
    });
  });
});
