import { Injectable, ConflictException, NotFoundException, Inject } from "@nestjs/common";
import { TenantConnectionManager } from "../../database/tenant-connection-manager";
import { CreateSampleDto, UpdateSampleStatusDto } from "./dto/samples.dto";
import { Sample, SampleStatus } from "./entities/sample.entity";
import { Laboratory } from "./entities/laboratory.entity";

@Injectable()
export class SamplesService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateSampleDto): Promise<Sample> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      // Validate laboratory existence
      const lab = await entityManager.findOne(Laboratory, { where: { id: dto.laboratoryId } });
      if (!lab) {
        throw new NotFoundException(`Laboratory with ID "${dto.laboratoryId}" not found`);
      }

      // Check unique sample code
      const existing = await entityManager.findOne(Sample, {
        where: { sampleCode: dto.sampleCode }
      });
      if (existing) {
        throw new ConflictException(`Sample with code "${dto.sampleCode}" already registered`);
      }

      const sample = entityManager.create(Sample, {
        sampleCode: dto.sampleCode,
        laboratoryId: dto.laboratoryId,
        collectedAt: new Date(dto.collectedAt),
        collectedBy: dto.collectedBy,
        sourceSiteId: dto.sourceSiteId || null,
        sourceStationId: dto.sourceStationId || null,
        status: SampleStatus.COLLECTED
      });

      return entityManager.save(Sample, sample);
    });
  }

  async findAll(laboratoryId?: string, status?: SampleStatus): Promise<Sample[]> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const where: any = {};
      if (laboratoryId) {
        where.laboratoryId = laboratoryId;
      }
      if (status) {
        where.status = status;
      }
      return entityManager.find(Sample, {
        where,
        relations: ["laboratory"],
        order: { collectedAt: "DESC" }
      });
    });
  }

  async findOne(id: string): Promise<Sample> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const sample = await entityManager.findOne(Sample, {
        where: { id },
        relations: ["laboratory", "analyses", "analyses.results"]
      });
      if (!sample) {
        throw new NotFoundException(`Sample with ID "${id}" not found`);
      }
      return sample;
    });
  }

  async updateStatus(id: string, dto: UpdateSampleStatusDto): Promise<Sample> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const sample = await entityManager.findOne(Sample, { where: { id } });
      if (!sample) {
        throw new NotFoundException(`Sample with ID "${id}" not found`);
      }

      sample.status = dto.status;
      return entityManager.save(Sample, sample);
    });
  }

  async delete(id: string): Promise<void> {
    return this.connectionManager.runInTransaction(async (entityManager) => {
      const sample = await entityManager.findOne(Sample, { where: { id } });
      if (!sample) {
        throw new NotFoundException(`Sample with ID "${id}" not found`);
      }
      await entityManager.remove(Sample, sample);
    });
  }
}
