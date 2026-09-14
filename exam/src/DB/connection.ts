import mongoose from "mongoose";
import { env } from "../config/config.service";

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;
