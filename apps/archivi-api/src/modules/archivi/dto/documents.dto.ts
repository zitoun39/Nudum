import { IsString, IsNotEmpty, IsOptional, IsUUID, IsArray, Length } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID("4")
  folderId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
