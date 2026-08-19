import { CorsOptions } from "cors";
import { env } from "../../config/config.service";

const whitelist :string[]=env.whitelist.split(",")

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {

        if(!origin){
            return callback(null, true)
        }

        if(whitelist.includes(origin)){
            return callback(null, true)
    }
       return callback(new Error("Not allowed by CORS"))


}}