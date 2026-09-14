import { IsOptional, IsEnum, IsString } from "class-validator";
import { JobLocation, WorkingTime, SeniorityLevel } from "../../../types/enums";

export class JobFilterDto {
  @IsOptional()
  @IsEnum(WorkingTime)
  workingTime?: WorkingTime;

  @IsOptional()
  @IsEnum(JobLocation)
  jobLocation?: JobLocation;

  @IsOptional()
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  technicalSkills?: string; // comma-separated list, parsed in the service

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
