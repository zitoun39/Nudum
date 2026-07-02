import { IsString, IsNotEmpty, IsOptional, IsUUID, Length } from "class-validator";

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name!: string;

  @IsOptional()
  @IsUUID("4")
  parentId?: string;
}

export class UpdateFolderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name!: string;
}
