import { bootstrap } from "./app.controller";


bootstrap().catch((error:unknown) => {
    console.error('failed to start the app:', error);
    process.exit(1);
});