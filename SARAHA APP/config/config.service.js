import { resolve } from "node:path";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import dotenv from "dotenv";
export const NODE_ENV = process.env.NODE_ENV || "development"; 


const envPath = {
    development: "dev.env",
    production: "prod.env",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const before = Object.keys(process.env).length;
dotenv.config({ path: resolve(__dirname, envPath[NODE_ENV]) });
const injected = Object.keys(process.env).length - before;
console.log(`injected env (${injected})`);

export const PORT = process.env.PORT || 6000;
export const DB_URL = process.env.DB_URL;
export const SALTROUNDS = process.env.SALTROUNDS || 10;
export const ENCRYPTION_KEY = process.env.Encription_key;
export const Access_Token_Secret_Admin = process.env.Access_Token_Secret_Admin;
export const Access_Token_Secret_User = process.env.Access_Token_Secret_User;
export const REFRESH_TOKEN_Secret_Admin = process.env.REFRESH_TOKEN_Secret_Admin;   
export const REFRESH_TOKEN_Secret_User = process.env.REFRESH_TOKEN_Secret_User; 
export const Access_Token_Admin_Expires_In = process.env.Access_Token_Admin_Expires_In || 1800; // 30 minutes
export const Client_ID = process.env.Client_ID;
export const UserEmail = process.env.UserEmail;
export const UserPassword = process.env.UserPassword;
export const WHITELIST=process.env.WHITELIST;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
console.log({ NODE_ENV, PORT, SALTROUNDS, hasEncryptionKey: Boolean(ENCRYPTION_KEY), hasAccessTokenSecretAdmin: Boolean(Access_Token_Secret_Admin), hasAccessTokenSecretUser: Boolean(Access_Token_Secret_User), hasClientID: Boolean(Client_ID) });


