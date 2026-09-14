import { IsString, IsOptional, IsEmail, IsEnum } from "class-validator";
import { CompanySize } from "../../../types/enums";

// Legal attachment is intentionally excluded — only the admin-managed upload endpoint touches it.
export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(CompanySize)
  numberOfEmployees?: CompanySize;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;
}
