import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import { LaboratoriesService } from "./laboratories.service";
import { CreateLaboratoryDto, UpdateLaboratoryDto } from "./dto/laboratories.dto";
import { Laboratory } from "./entities/laboratory.entity";

@Controller("laboratories")
export class LaboratoriesController {
  constructor(private readonly laboratoriesService: LaboratoriesService) {}

  @Post()
  async create(@Body() dto: CreateLaboratoryDto): Promise<Laboratory> {
    return this.laboratoriesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Laboratory[]> {
    return this.laboratoriesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Laboratory> {
    return this.laboratoriesService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateLaboratoryDto): Promise<Laboratory> {
    return this.laboratoriesService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.laboratoriesService.delete(id);
  }
}
