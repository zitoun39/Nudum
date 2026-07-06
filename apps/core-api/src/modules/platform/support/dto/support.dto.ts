import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  moduleKey?: string;
}
