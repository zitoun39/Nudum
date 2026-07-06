import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject
} from "@nestjs/common";
import { TenantConnectionManager } from "@nudum/database";
import {
  Correspondence,
  CorrespondenceStatus,
  CorrespondenceType
} from "./entities/correspondence.entity";
import { Document } from "./entities/document.entity";
import { CreateCorrespondenceDto } from "./dto/correspondences.dto";

@Injectable()
export class CorrespondencesService {
  constructor(
    @Inject(TenantConnectionManager)
    private readonly connectionManager: TenantConnectionManager
  ) {}

  async create(dto: CreateCorrespondenceDto): Promise<Correspondence> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const existing = await manager.findOne(Correspondence, {
        where: { referenceNumber: dto.referenceNumber }
      });
      if (existing) {
        throw new ConflictException(
          `Correspondence with reference number "${dto.referenceNumber}" already exists`
        );
      }

      let document: Document | null = null;
      if (dto.documentId) {
        document = await manager.findOne(Document, { where: { id: dto.documentId } });
        if (!document) {
          throw new NotFoundException(`Attached document with ID ${dto.documentId} not found`);
        }
      }

      const correspondence = manager.create(Correspondence, {
        type: dto.type,
        referenceNumber: dto.referenceNumber,
        sender: dto.sender,
        recipient: dto.recipient,
        subject: dto.subject,
        documentId: dto.documentId || null,
        document,
        receivedSentAt: new Date(dto.receivedSentAt),
        status: CorrespondenceStatus.DRAFT
      });

      return manager.save(Correspondence, correspondence);
    });
  }

  async updateStatus(id: string, status: CorrespondenceStatus): Promise<Correspondence> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const correspondence = await manager.findOne(Correspondence, { where: { id } });
      if (!correspondence) {
        throw new NotFoundException(`Correspondence with ID ${id} not found`);
      }

      const currentStatus = correspondence.status;

      if (
        currentStatus === CorrespondenceStatus.APPROVED ||
        currentStatus === CorrespondenceStatus.REJECTED
      ) {
        throw new BadRequestException(
          `Cannot change status of a finalized correspondence (${currentStatus})`
        );
      }

      if (
        currentStatus === CorrespondenceStatus.DRAFT &&
        status !== CorrespondenceStatus.PENDING_REVIEW &&
        status !== CorrespondenceStatus.DRAFT
      ) {
        throw new BadRequestException(
          "Draft correspondence can only be transitioned to pending_review"
        );
      }

      correspondence.status = status;
      return manager.save(Correspondence, correspondence);
    });
  }

  async findAll(
    type?: CorrespondenceType,
    status?: CorrespondenceStatus,
    search?: string
  ): Promise<Correspondence[]> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const query = manager
        .createQueryBuilder(Correspondence, "corr")
        .leftJoinAndSelect("corr.document", "document");

      if (type) {
        query.andWhere("corr.type = :type", { type });
      }

      if (status) {
        query.andWhere("corr.status = :status", { status });
      }

      if (search) {
        query.andWhere(
          "(corr.reference_number ILIKE :search OR corr.sender ILIKE :search OR corr.recipient ILIKE :search OR corr.subject ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      return query.orderBy("corr.created_at", "DESC").getMany();
    });
  }

  async findOne(id: string): Promise<Correspondence> {
    return this.connectionManager.runInTransaction(async (manager) => {
      const correspondence = await manager.findOne(Correspondence, {
        where: { id },
        relations: ["document"]
      });
      if (!correspondence) {
        throw new NotFoundException(`Correspondence with ID ${id} not found`);
      }
      return correspondence;
    });
  }
}
