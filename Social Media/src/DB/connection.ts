import mongoose from "mongoose";
import {env} from '../config/config.service'

const connectDB = async ():Promise<void> => {

    try {
        const conn = await mongoose.connect(env.Mongo_URI ,{
        serverSelectionTimeoutMS: 5000,});

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        throw error;
    }
}

export default connectDB;