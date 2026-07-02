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
import { EquipmentService } from "./equipment.service";
import { CreateEquipmentDto, UpdateEquipmentDto } from "./dto/equipment.dto";
import { Equipment } from "./entities/equipment.entity";

@Controller("equipment")
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  async create(@Body() dto: CreateEquipmentDto): Promise<Equipment> {
    return this.equipmentService.create(dto);
  }

  @Get()
  async findAll(@Query("stationId") stationId?: string): Promise<Equipment[]> {
    return this.equipmentService.findAll(stationId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Equipment> {
    return this.equipmentService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateEquipmentDto): Promise<Equipment> {
    return this.equipmentService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string): Promise<void> {
    return this.equipmentService.delete(id);
  }
}
