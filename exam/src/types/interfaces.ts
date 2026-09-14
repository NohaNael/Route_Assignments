import { Types } from "mongoose";
import { OtpType, ApplicationStatus, JobLocation, WorkingTime, SeniorityLevel, Role, Gender, Provider } from "./enums";

export interface IMedia {
  secure_url: string;
  public_id: string;
}

export interface IOtp {
  code: string; // hashed
  type: OtpType;
  expiresIn: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  provider: Provider;
  gender: Gender;
  DOB: Date;
  mobileNumber: string;
  role: Role;
  isConfirmed: boolean;
  deletedAt?: Date | null;
  bannedAt?: Date | null;
  updatedBy?: Types.ObjectId | null;
  changeCredentialTime?: Date | null;
  profilePic?: IMedia;
  coverPic?: IMedia;
  OTP: IOtp[];
}

export interface ICompany {
  _id: Types.ObjectId;
  companyName: string;
  description: string;
  industry: string;
  address: string;
  numberOfEmployees: string;
  companyEmail: string;
  createdBy: Types.ObjectId;
  logo?: IMedia;
  coverPic?: IMedia;
  HRs: Types.ObjectId[];
  bannedAt?: Date | null;
  deletedAt?: Date | null;
  legalAttachment: IMedia;
  approvedByAdmin: boolean;
}

export interface IApplication {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  userCV: IMedia;
  status: ApplicationStatus;
}

export interface IJob {
  _id: Types.ObjectId;
  jobTitle: string;
  jobLocation: JobLocation;
  workingTime: WorkingTime;
  seniorityLevel: SeniorityLevel;
  jobDescription: string;
  technicalSkills: string[];
  softSkills: string[];
  addedBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
  closed: boolean;
  companyId: Types.ObjectId;
}

export interface IChatMessage {
  message: string;
  senderId: Types.ObjectId;
  sentAt?: Date;
}

export interface IChat {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  messages: IChatMessage[];
}

export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
