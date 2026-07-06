import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import { CreateResultDto } from "./dto/results.dto";
import { Result } from "./entities/result.entity";
import { Analysis, AnalysisStatus } from "./entities/analysis.entity";

@Injectable()
export class ResultsService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateResultDto): Promise<Result> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      // Validate analysis existence
      const analysis = await entityManager.findOne(Analysis, { where: { id: dto.analysisId } });
      if (!analysis) {
        throw new NotFoundException(`Analysis with ID "${dto.analysisId}" not found`);
      }

      const result = entityManager.create(Result, {
        analysisId: dto.analysisId,
        parameterName: dto.parameterName,
        value: dto.value,
        unit: dto.unit,
        isConforming: dto.isConforming !== undefined ? dto.isConforming : true
      });

      const savedResult = await entityManager.save(Result, result);

      // Auto-complete analysis test run if it was in progress/pending
      if (analysis.status !== AnalysisStatus.COMPLETED) {
        analysis.status = AnalysisStatus.COMPLETED;
        analysis.completedAt = new Date();
        await entityManager.save(Analysis, analysis);
      }

      return savedResult;
    });
  }

  async findByAnalysis(analysisId: string): Promise<Result[]> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      return entityManager.find(Result, {
        where: { analysisId },
        order: { createdAt: "ASC" }
      });
    });
  }

  async findOne(id: string): Promise<Result> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const result = await entityManager.findOne(Result, {
        where: { id },
        relations: ["analysis"]
      });
      if (!result) {
        throw new NotFoundException(`Result with ID "${id}" not found`);
      }
      return result;
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const result = await entityManager.findOne(Result, { where: { id } });
      if (!result) {
        throw new NotFoundException(`Result with ID "${id}" not found`);
      }
      await entityManager.remove(Result, result);
    });
  }
}
