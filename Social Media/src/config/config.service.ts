import { resolve } from 'path';
import { config } from 'dotenv';


config({path: resolve( './config/dev.env')});

export const env = {
    PORT: process.env.PORT || 3031,
    APP_NAME: process.env.APP_NAME || 'Social Media',
    MODE:process.env.MODE || 'development',
    Mongo_URI: process.env.Mongo_URI as string,

    SALT_ROUND:Number(process.env.SALT_ROUNDS) || 10,

    Email_Host: process.env.Email_Host,
    Email_Port: Number(process.env.Email_Port) || 587,
    Email_User: process.env.Email_User as string,
    Email_Password: process.env.Email_Password as string,

    Access_user_signature: process.env.Access_user_signature as string,
    Access_admin_signature: process.env.Access_admin_signature as string,
    Refresh_user_signature: process.env.Refresh_user_signature as string,
    Refresh_admin_signature: process.env.Refresh_admin_signature as string, 
    Access_token_expiration: process.env.Access_token_expiration || '1d',

    Refresh_token_expiration: process.env.Refresh_token_expiration || '7d',

    Encryption_key: process.env.Encryption_key as string,

    whitelist: process.env.whitelist as string,

  }

  export type Env = typeof env;