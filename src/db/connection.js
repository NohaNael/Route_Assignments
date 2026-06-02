import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect("mongodb://localhost:27017/myapp", {
        serverSelectionTimeoutMS: 5000, // Optional: Set a timeout for server selection
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

