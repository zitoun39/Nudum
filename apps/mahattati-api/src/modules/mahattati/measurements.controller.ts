import { Controller, Get, Post, Body, Param, Query, UseGuards } from "@nestjs/common";
import { MeasurementsService } from "./measurements.service";
import { CreateMeasurementDto } from "./dto/measurements.dto";
import { Measurement } from "./entities/measurement.entity";
import { AuthGuard, ModuleAccessGuard, RequireModule } from "@nudum/auth-client";

@UseGuards(AuthGuard, ModuleAccessGuard)
@RequireModule("mahattati")
@Controller("measurements")
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  async create(@Body() dto: CreateMeasurementDto): Promise<Measurement> {
    return this.measurementsService.create(dto);
  }

  @Get()
  async findAll(
    @Query("stationId") stationId?: string,
    @Query("equipmentId") equipmentId?: string,
    @Query("parameterName") parameterName?: string
  ): Promise<Measurement[]> {
    return this.measurementsService.findAll(stationId, equipmentId, parameterName);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Measurement> {
    return this.measurementsService.findOne(id);
  }
}
