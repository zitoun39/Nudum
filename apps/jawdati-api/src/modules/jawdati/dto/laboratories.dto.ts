import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateLaboratoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;
}

export class UpdateLaboratoryDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;
}
