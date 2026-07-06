import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/documents.dto";
import { Document } from "./entities/document.entity";
import { Version } from "./entities/version.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";
import { TenantContextService } from "@nudum/database";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("archivi")
@Controller("documents")
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    @Inject(TenantContextService)
    private readonly tenantContext: TenantContextService
  ) {}

  @Post()
  async create(@Body() dto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(dto);
  }

  @Post(":id/versions")
  @UseInterceptors(FileInterceptor("file"))
  async uploadVersion(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile() file: any
  ): Promise<Version> {
    const userId = this.tenantContext.getUserId() || "usr-admin";
    return this.documentsService.uploadVersion(id, file, userId);
  }

  @Get(":id/versions/:versionId/download")
  async getDownloadUrl(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("versionId", ParseUUIDPipe) versionId: string
  ): Promise<{ url: string }> {
    const url = await this.documentsService.getPresignedDownloadUrl(id, versionId);
    return { url };
  }

  @Get()
  async findAll(
    @Query("folderId") folderId?: string,
    @Query("tagId") tagId?: string,
    @Query("search") search?: string
  ): Promise<Document[]> {
    return this.documentsService.findAll(folderId, tagId, search);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.documentsService.delete(id);
  }
}
