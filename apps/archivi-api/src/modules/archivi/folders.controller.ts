import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { FoldersService } from "./folders.service";
import { CreateFolderDto, UpdateFolderDto } from "./dto/folders.dto";
import { Folder } from "./entities/folder.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("archivi")
@Controller("folders")
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(@Body() dto: CreateFolderDto): Promise<Folder> {
    return this.foldersService.create(dto);
  }

  @Get()
  async findAll(): Promise<Folder[]> {
    return this.foldersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<Folder> {
    return this.foldersService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateFolderDto
  ): Promise<Folder> {
    return this.foldersService.update(id, dto.name);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.foldersService.delete(id);
  }
}
