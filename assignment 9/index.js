import express from "express";
import { bootstrap } from "./src/utils/app.controller.js";
const app = express();
const PORT = 3000;  
await bootstrap(app, express);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
