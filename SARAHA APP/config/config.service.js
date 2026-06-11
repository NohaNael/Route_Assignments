import { resolve } from "node:path";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const NODE_ENV = process.env.NODE_ENV || "development"; 

const envPath = {
    development: "dev.env",
    production: "prod.env",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const before = Object.keys(process.env).length;
process.loadEnvFile(resolve(__dirname, envPath[NODE_ENV]));
const injected = Object.keys(process.env).length - before;
console.log(`injected env (${injected})`);

export const PORT = process.env.PORT || 6000;
export const DB_URL = process.env.DB_URL;
export const SALTROUNDS = process.env.SALTROUNDS || 10;
console.log({ NODE_ENV, PORT });
