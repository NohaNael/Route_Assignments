import { IsString, IsNotEmpty, IsEnum, IsArray, ArrayNotEmpty, IsMongoId } from "class-validator";
import { JobLocation, WorkingTime, SeniorityLevel } from "../../../types/enums";

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  jobTitle!: string;

  @IsEnum(JobLocation)
  jobLocation!: JobLocation;

  @IsEnum(WorkingTime)
  workingTime!: WorkingTime;

  @IsEnum(SeniorityLevel)
  seniorityLevel!: SeniorityLevel;

  @IsString()
  @IsNotEmpty()
  jobDescription!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  technicalSkills!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  softSkills!: string[];
}
