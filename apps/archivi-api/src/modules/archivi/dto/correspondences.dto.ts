import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  IsISO8601,
  Length
} from "class-validator";
import { CorrespondenceType, CorrespondenceStatus } from "../entities/correspondence.entity";

export class CreateCorrespondenceDto {
  @IsEnum(CorrespondenceType)
  @IsNotEmpty()
  type!: CorrespondenceType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  referenceNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  sender!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  recipient!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  subject!: string;

  @IsOptional()
  @IsUUID("4")
  documentId?: string;

  @IsISO8601()
  @IsNotEmpty()
  receivedSentAt!: string;
}

export class UpdateCorrespondenceStatusDto {
  @IsEnum(CorrespondenceStatus)
  @IsNotEmpty()
  status!: CorrespondenceStatus;
}
