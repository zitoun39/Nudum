import { Module } from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { FoldersController } from "./folders.controller";
import { TagsService } from "./tags.service";
import { TagsController } from "./tags.controller";

@Module({
  imports: [],
  controllers: [FoldersController, TagsController],
  providers: [FoldersService, TagsService],
  exports: [FoldersService, TagsService]
})
export class ArchiviModule {}
