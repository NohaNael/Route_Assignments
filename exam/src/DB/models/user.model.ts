import mongoose, { Schema } from "mongoose";
import { Gender, OtpType, Provider, Role } from "../../types/enums";

const otpSchema = new Schema(
  {
    code: { type: String, required: true },
    type: { type: String, enum: Object.values(OtpType), required: true },
    expiresIn: { type: Date, required: true },
  },
  { _id: false }
);

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  provider: { type: String, enum: Object.values(Provider), required: true },
  gender: { type: String, enum: Object.values(Gender) },
  DOB: Date,
  mobileNumber: String,
  role: { type: String, enum: Object.values(Role), required: true },
  isConfirmed: { type: Boolean, default: false },
  deletedAt: Date,
  bannedAt: Date,
  updatedBy: Schema.Types.ObjectId,
  changeCredentialTime: Date,
  profilePic: { secure_url: String, public_id: String },
  coverPic: { secure_url: String, public_id: String },
  OTP: [otpSchema],
});

export const UserModel = mongoose.model("User", userSchema);
