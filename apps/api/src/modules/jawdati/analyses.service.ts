import { Injectable, NotFoundException } from "@nestjs/common";
import { TenantConnectionManager } from "../../database/tenant-connection-manager";
import { CreateAnalysisDto, UpdateAnalysisStatusDto } from "./dto/analyses.dto";
import { Analysis, AnalysisStatus } from "./entities/analysis.entity";
import { Sample } from "./entities/sample.entity";

@Injectable()
export class AnalysesService {
  constructor(private readonly connectionManager: TenantConnectionManager) {}

  async create(dto: CreateAnalysisDto): Promise<Analysis> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const sample = await entityManager.findOne(Sample, { where: { id: dto.sampleId } });
      if (!sample) {
        throw new NotFoundException(`Sample with ID "${dto.sampleId}" not found`);
      }

      const analysis = entityManager.create(Analysis, {
        sampleId: dto.sampleId,
        testMethod: dto.testMethod,
        analystId: dto.analystId,
        status: AnalysisStatus.PENDING
      });

      return entityManager.save(Analysis, analysis);
    });
  }

  async findAll(sampleId?: string, status?: AnalysisStatus): Promise<Analysis[]> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const where: any = {};
      if (sampleId) {
        where.sampleId = sampleId;
      }
      if (status) {
        where.status = status;
      }
      return entityManager.find(Analysis, {
        where,
        relations: ["sample", "results"],
        order: { createdAt: "DESC" }
      });
    });
  }

  async findOne(id: string): Promise<Analysis> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const analysis = await entityManager.findOne(Analysis, {
        where: { id },
        relations: ["sample", "results"]
      });
      if (!analysis) {
        throw new NotFoundException(`Analysis with ID "${id}" not found`);
      }
      return analysis;
    });
  }

  async updateStatus(id: string, dto: UpdateAnalysisStatusDto): Promise<Analysis> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const analysis = await entityManager.findOne(Analysis, { where: { id } });
      if (!analysis) {
        throw new NotFoundException(`Analysis with ID "${id}" not found`);
      }

      analysis.status = dto.status;
      if (dto.startedAt) {
        analysis.startedAt = new Date(dto.startedAt);
      }
      if (dto.completedAt) {
        analysis.completedAt = new Date(dto.completedAt);
      }

      return entityManager.save(Analysis, analysis);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const analysis = await entityManager.findOne(Analysis, { where: { id } });
      if (!analysis) {
        throw new NotFoundException(`Analysis with ID "${id}" not found`);
      }
      await entityManager.remove(Analysis, analysis);
    });
  }
}
