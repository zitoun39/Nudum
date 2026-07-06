import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/tags.dto";
import { Tag } from "./entities/tag.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("archivi")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(dto);
  }

  @Get()
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }
}
