import { bootstrap } from "./app.controller";

bootstrap().catch((error: unknown) => {
    console.error("Failed to bootstrap the application:", error);
    process.exit(1);
});