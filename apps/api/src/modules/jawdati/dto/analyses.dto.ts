import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  MaxLength,
  IsDateString
} from "class-validator";
import { AnalysisStatus } from "../entities/analysis.entity";

export class CreateAnalysisDto {
  @IsUUID()
  @IsNotEmpty()
  sampleId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  testMethod!: string;

  @IsUUID()
  @IsNotEmpty()
  analystId!: string;
}

export class UpdateAnalysisStatusDto {
  @IsEnum(AnalysisStatus)
  @IsNotEmpty()
  status!: AnalysisStatus;

  @IsDateString()
  @IsOptional()
  startedAt?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;
}
