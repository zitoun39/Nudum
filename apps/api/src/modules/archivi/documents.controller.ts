import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/documents.dto";
import { Document } from "./entities/document.entity";
import { Version } from "./entities/version.entity";

@Controller("api/documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(dto);
  }

  @Post(":id/versions")
  @UseInterceptors(FileInterceptor("file"))
  async uploadVersion(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile() file: any,
    @Req() req: Request
  ): Promise<Version> {
    const userId = (req as any).user?.id || "admin";
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
