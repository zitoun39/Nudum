import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { AnalysesService } from "./analyses.service";
import { CreateAnalysisDto, UpdateAnalysisStatusDto } from "./dto/analyses.dto";
import { Analysis, AnalysisStatus } from "./entities/analysis.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("jawdati")
@Controller("analyses")
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  async create(@Body() dto: CreateAnalysisDto): Promise<Analysis> {
    return this.analysesService.create(dto);
  }

  @Get()
  async findAll(
    @Query("sampleId") sampleId?: string,
    @Query("status") status?: AnalysisStatus
  ): Promise<Analysis[]> {
    return this.analysesService.findAll(sampleId, status);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Analysis> {
    return this.analysesService.findOne(id);
  }

  @Put(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateAnalysisStatusDto
  ): Promise<Analysis> {
    return this.analysesService.updateStatus(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.analysesService.delete(id);
  }
}
