import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  MaxLength,
  IsDateString
} from "class-validator";
import { SampleStatus } from "../entities/sample.entity";

export class CreateSampleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sampleCode!: string;

  @IsUUID()
  @IsNotEmpty()
  laboratoryId!: string;

  @IsDateString()
  @IsNotEmpty()
  collectedAt!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  collectedBy!: string;

  @IsUUID()
  @IsOptional()
  sourceSiteId?: string;

  @IsUUID()
  @IsOptional()
  sourceStationId?: string;
}

export class UpdateSampleStatusDto {
  @IsEnum(SampleStatus)
  @IsNotEmpty()
  status!: SampleStatus;
}
