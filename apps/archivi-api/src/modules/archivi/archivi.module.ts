import { Module } from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { FoldersController } from "./folders.controller";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { CorrespondencesService } from "./correspondences.service";
import { CorrespondencesController } from "./correspondences.controller";

@Module({
  imports: [],
  controllers: [FoldersController, TagsController, DocumentsController, CorrespondencesController],
  providers: [FoldersService, TagsService, DocumentsService, CorrespondencesService],
  exports: [FoldersService, TagsService, DocumentsService, CorrespondencesService]
})
export class ArchiviModule {}
