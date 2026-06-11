import mongoose from "mongoose";
import { DB_URL } from "../../config/config.service.js";



const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL, {    
            serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
    }
};

export default connectDB;