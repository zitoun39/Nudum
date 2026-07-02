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
  HttpStatus
} from "@nestjs/common";
import { SamplesService } from "./samples.service";
import { CreateSampleDto, UpdateSampleStatusDto } from "./dto/samples.dto";
import { Sample, SampleStatus } from "./entities/sample.entity";

@Controller("samples")
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Post()
  async create(@Body() dto: CreateSampleDto): Promise<Sample> {
    return this.samplesService.create(dto);
  }

  @Get()
  async findAll(
    @Query("laboratoryId") laboratoryId?: string,
    @Query("status") status?: SampleStatus
  ): Promise<Sample[]> {
    return this.samplesService.findAll(laboratoryId, status);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Sample> {
    return this.samplesService.findOne(id);
  }

  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() dto: UpdateSampleStatusDto): Promise<Sample> {
    return this.samplesService.updateStatus(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.samplesService.delete(id);
  }
}
