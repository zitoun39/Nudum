import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name!: string;
}
