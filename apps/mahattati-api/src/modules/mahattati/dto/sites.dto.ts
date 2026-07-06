import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;
}

export class UpdateSiteDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;
}
