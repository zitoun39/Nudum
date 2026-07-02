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
import { StationsService } from "./stations.service";
import { CreateStationDto, UpdateStationDto } from "./dto/stations.dto";
import { Station } from "./entities/station.entity";

@Controller("stations")
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  async create(@Body() dto: CreateStationDto): Promise<Station> {
    return this.stationsService.create(dto);
  }

  @Get()
  async findAll(@Query("siteId") siteId?: string): Promise<Station[]> {
    return this.stationsService.findAll(siteId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Station> {
    return this.stationsService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateStationDto): Promise<Station> {
    return this.stationsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.stationsService.delete(id);
  }
}
