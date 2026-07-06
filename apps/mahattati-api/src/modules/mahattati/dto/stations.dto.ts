import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  Min
} from "class-validator";
import { StationStatus } from "../entities/station.entity";

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsUUID()
  @IsNotEmpty()
  siteId!: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  capacityM3Day?: number;

  @IsEnum(StationStatus)
  @IsOptional()
  status?: StationStatus;
}

export class UpdateStationDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  capacityM3Day?: number;

  @IsEnum(StationStatus)
  @IsOptional()
  status?: StationStatus;
}
