import dotenv  from "dotenv";
import { connectToDB } from "./DB/models/connection.js";
import { bookRouter } from "./modules/books/index.js";
dotenv.config({ path: "./src/config/dev.env" });
export const bootstrap = async (app,express) => {
    app.use(express.json());
    
   
    await connectToDB();

  
    console.log("Mounting bookRouter at /api/v1/books");
    console.log("bookRouter:", bookRouter);
    app.use("/api/v1/books", bookRouter);
    console.log("Routes mounted successfully");
}