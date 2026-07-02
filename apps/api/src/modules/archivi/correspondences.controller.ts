import { Controller, Get, Post, Put, Body, Param, Query, ParseUUIDPipe } from "@nestjs/common";
import { CorrespondencesService } from "./correspondences.service";
import { CreateCorrespondenceDto, UpdateCorrespondenceStatusDto } from "./dto/correspondences.dto";
import {
  Correspondence,
  CorrespondenceType,
  CorrespondenceStatus
} from "./entities/correspondence.entity";

@Controller("api/correspondences")
export class CorrespondencesController {
  constructor(private readonly correspondencesService: CorrespondencesService) {}

  @Post()
  async create(@Body() dto: CreateCorrespondenceDto): Promise<Correspondence> {
    return this.correspondencesService.create(dto);
  }

  @Get()
  async findAll(
    @Query("type") type?: CorrespondenceType,
    @Query("status") status?: CorrespondenceStatus,
    @Query("search") search?: string
  ): Promise<Correspondence[]> {
    return this.correspondencesService.findAll(type, status, search);
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<Correspondence> {
    return this.correspondencesService.findOne(id);
  }

  @Put(":id/status")
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCorrespondenceStatusDto
  ): Promise<Correspondence> {
    return this.correspondencesService.updateStatus(id, dto.status);
  }
}
