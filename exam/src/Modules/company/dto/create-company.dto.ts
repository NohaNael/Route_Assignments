import { IsString, IsNotEmpty, IsEmail, IsEnum } from "class-validator";
import { CompanySize } from "../../../types/enums";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsEnum(CompanySize, { message: "numberOfEmployees must be a valid range, e.g. 11-20" })
  numberOfEmployees!: CompanySize;

  @IsEmail()
  companyEmail!: string;
}
