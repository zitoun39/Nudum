import { Controller, Get, Post, Body } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/tags.dto";
import { Tag } from "./entities/tag.entity";

@Controller("api/tags")
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
