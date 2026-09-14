// Centralized enums so no string literals are hardcoded across the codebase.

export enum Role {
  USER = "User",
  ADMIN = "Admin",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum Provider {
  GOOGLE = "google",
  SYSTEM = "system",
}

export enum OtpType {
  CONFIRM_EMAIL = "confirmEmail",
  FORGET_PASSWORD = "forgetPassword",
}

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  VIEWED = "viewed",
  IN_CONSIDERATION = "in consideration",
  REJECTED = "rejected",
}

export enum JobLocation {
  ONSITE = "onsite",
  REMOTELY = "remotely",
  HYBRID = "hybrid",
}

export enum WorkingTime {
  PART_TIME = "part-time",
  FULL_TIME = "full-time",
}

export enum SeniorityLevel {
  FRESH = "fresh",
  JUNIOR = "Junior",
  MID_LEVEL = "Mid-Level",
  SENIOR = "Senior",
  TEAM_LEAD = "Team-Lead",
  CTO = "CTO",
}

export enum CompanySize {
  RANGE_1_10 = "1-10",
  RANGE_11_20 = "11-20",
  RANGE_21_50 = "21-50",
  RANGE_51_100 = "51-100",
  RANGE_100_PLUS = "100+",
}
