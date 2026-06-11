import express from 'express';
import {PORT} from './config/config.service.js'
import bootstrap from './src/utils/app.controller.js'
const app = express();
const port = PORT || 8000;
bootstrap(app, express)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});