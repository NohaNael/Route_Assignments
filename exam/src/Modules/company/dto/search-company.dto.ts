import { IsString, IsNotEmpty } from "class-validator";

export class SearchCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
