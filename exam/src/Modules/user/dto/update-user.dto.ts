import { IsOptional, IsString, IsEnum, IsDateString, Matches } from "class-validator";
import { Gender } from "../../../types/enums";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  DOB?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "mobileNumber must be a valid phone number" })
  mobileNumber?: string;
}
