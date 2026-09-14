import { IsEnum } from "class-validator";
import { ApplicationStatus } from "../../../types/enums";

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus, { message: "status must be one of: pending, accepted, viewed, in consideration, rejected" })
  status!: ApplicationStatus;
}
