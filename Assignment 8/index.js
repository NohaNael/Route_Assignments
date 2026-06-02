import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/dev.env" });

const app = express();
const PORT = process.env.PORT || 800;
import { bootstrap } from "./src/app.controller.js";

await bootstrap(app, express);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});