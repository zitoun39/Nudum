import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDateString
} from "class-validator";

export class CreateMeasurementDto {
  @IsUUID()
  @IsNotEmpty()
  stationId!: string;

  @IsUUID()
  @IsOptional()
  equipmentId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  parameterName!: string;

  @IsNumber()
  @IsNotEmpty()
  value!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  unit!: string;

  @IsUUID()
  @IsNotEmpty()
  loggedBy!: string;

  @IsDateString()
  @IsOptional()
  loggedAt?: string;
}
