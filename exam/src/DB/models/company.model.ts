import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  companyName: { type: String, required: true, unique: true },
  description: String,
  industry: String,
  address: String,
  numberOfEmployees: String,
  companyEmail: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  logo: { secure_url: String, public_id: String },
  coverPic: { secure_url: String, public_id: String },
  HRs: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bannedAt: Date,
  deletedAt: Date,
  legalAttachment: { secure_url: String, public_id: String },
  approvedByAdmin: { type: Boolean, default: false },
});

export const CompanyModel = mongoose.model("Company", companySchema);
