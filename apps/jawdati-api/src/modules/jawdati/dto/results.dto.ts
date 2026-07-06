import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsOptional,
  MaxLength
} from "class-validator";

export class CreateResultDto {
  @IsUUID()
  @IsNotEmpty()
  analysisId!: string;

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

  @IsBoolean()
  @IsOptional()
  isConforming?: boolean;
}
