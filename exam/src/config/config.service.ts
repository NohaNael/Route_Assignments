import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: required("MONGO_URI"),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,

  ENCRYPTION_KEY: required("ENCRYPTION_KEY"),
  ENCRYPTION_IV: required("ENCRYPTION_IV"),

  OTP_EXPIRES_IN_MINUTES: Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  MAIL_HOST: process.env.MAIL_HOST || "",
  MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASS: process.env.MAIL_PASS || "",
  MAIL_FROM: process.env.MAIL_FROM || "Job Search App <no-reply@jobsearchapp.com>",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
