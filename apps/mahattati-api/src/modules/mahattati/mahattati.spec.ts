import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SitesService } from "./sites.service";
import { StationsService } from "./stations.service";
import { EquipmentService } from "./equipment.service";
import { MeasurementsService } from "./measurements.service";
import { TenantConnectionManager } from "@nudum/database";
import { StationStatus } from "./entities/station.entity";
import { EquipmentStatus } from "./entities/equipment.entity";

describe("Mahattati Services Unit Tests", () => {
  let sitesService: SitesService;
  let stationsService: StationsService;
  let equipmentService: EquipmentService;
  let measurementsService: MeasurementsService;

  const mockEntityManager = {
    create: vi.fn((_entity, data) => data),
    save: vi.fn((_entity, data) => Promise.resolve({ id: "mock-id", ...data })),
    findOne: vi.fn(),
    find: vi.fn(),
    count: vi.fn(),
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

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        StationsService,
        EquipmentService,
        MeasurementsService,
        { provide: TenantConnectionManager, useValue: mockConnectionManager }
      ]
    }).compile();

    sitesService = module.get<SitesService>(SitesService);
    stationsService = module.get<StationsService>(StationsService);
    equipmentService = module.get<EquipmentService>(EquipmentService);
    measurementsService = module.get<MeasurementsService>(MeasurementsService);
  });

  describe("SitesService", () => {
    it("should create a site", async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      const result = await sitesService.create({ name: "Dam Site A", location: "North region" });
      expect(result.name).toBe("Dam Site A");
    });
  });

  describe("StationsService", () => {
    it("should create a station", async () => {
      mockEntityManager.findOne
        .mockResolvedValueOnce({ id: "site-uuid", name: "Dam Site A" })
        .mockResolvedValueOnce(null);
      const result = await stationsService.create({
        name: "Pumping Station 1",
        siteId: "site-uuid",
        capacityM3Day: 5000,
        status: StationStatus.ACTIVE
      });
      expect(result.name).toBe("Pumping Station 1");
    });
  });

  describe("EquipmentService", () => {
    it("should register equipment", async () => {
      mockEntityManager.findOne
        .mockResolvedValueOnce({ id: "station-uuid", name: "Pumping Station 1" })
        .mockResolvedValueOnce(null);
      const result = await equipmentService.create({
        name: "Intake Pump A",
        serialNumber: "SN-9988",
        stationId: "station-uuid",
        type: "pump",
        status: EquipmentStatus.OPERATIONAL
      });
      expect(result.name).toBe("Intake Pump A");
    });
  });

  describe("MeasurementsService", () => {
    it("should log telemetry measurement", async () => {
      mockEntityManager.findOne
        .mockResolvedValueOnce({ id: "station-uuid", name: "Pumping Station 1" })
        .mockResolvedValueOnce({ id: "equip-uuid", name: "Intake Pump A" });
      const result = await measurementsService.create({
        stationId: "station-uuid",
        equipmentId: "equip-uuid",
        parameterName: "flow_rate",
        value: 120.5,
        unit: "m3/h",
        loggedBy: "user-uuid"
      });
      expect(result.parameterName).toBe("flow_rate");
      expect(result.value).toBe(120.5);
    });
  });
});
