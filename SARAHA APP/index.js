import express from 'express';
import dotenv from 'dotenv';
import bootstrap from './src/utils/app.controller.js'
dotenv.config({ path: './config/.env' });
const app = express();
const port = process.env.PORT || 8000;
bootstrap(app, express)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});