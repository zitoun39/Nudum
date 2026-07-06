import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { SitesService } from "./sites.service";
import { CreateSiteDto, UpdateSiteDto } from "./dto/sites.dto";
import { Site } from "./entities/site.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("mahattati")
@Controller("sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  async create(@Body() dto: CreateSiteDto): Promise<Site> {
    return this.sitesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Site[]> {
    return this.sitesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Site> {
    return this.sitesService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateSiteDto): Promise<Site> {
    return this.sitesService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.sitesService.delete(id);
  }
}
