import { IsString, IsOptional, IsEnum, IsArray, IsBoolean } from "class-validator";
import { JobLocation, WorkingTime, SeniorityLevel } from "../../../types/enums";

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsEnum(JobLocation)
  jobLocation?: JobLocation;

  @IsOptional()
  @IsEnum(WorkingTime)
  workingTime?: WorkingTime;

  @IsOptional()
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technicalSkills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  softSkills?: string[];

  @IsOptional()
  @IsBoolean()
  closed?: boolean;
}
