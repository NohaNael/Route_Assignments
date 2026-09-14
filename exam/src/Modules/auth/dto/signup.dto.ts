import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class SignupDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/)
  mobileNumber!: string;

  @IsString()
  DOB!: string;
}