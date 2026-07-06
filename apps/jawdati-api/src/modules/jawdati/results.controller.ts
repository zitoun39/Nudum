import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { ResultsService } from "./results.service";
import { CreateResultDto } from "./dto/results.dto";
import { Result } from "./entities/result.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("jawdati")
@Controller("results")
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  async create(@Body() dto: CreateResultDto): Promise<Result> {
    return this.resultsService.create(dto);
  }

  @Get()
  async findByAnalysis(@Query("analysisId") analysisId: string): Promise<Result[]> {
    return this.resultsService.findByAnalysis(analysisId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Result> {
    return this.resultsService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.resultsService.delete(id);
  }
}
