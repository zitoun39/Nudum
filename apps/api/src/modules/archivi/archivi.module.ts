import { Module } from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { FoldersController } from "./folders.controller";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";

@Module({
  imports: [],
  controllers: [FoldersController, TagsController, DocumentsController],
  providers: [FoldersService, TagsService, DocumentsService],
  exports: [FoldersService, TagsService, DocumentsService]
})
export class ArchiviModule {}
