import { WHITELIST } from "../../../config/config.service.js";
import { badRequestResponse } from "../err.response.js";


export function cors() {
    const whitelist = WHITELIST.split(",").map((url) => url.trim());
    const corsOption={
        origin: function (origin, callback) {
            if(whitelist.includes(origin)){
                callback(null, true);
            }   
            else if(!origin) {
                callback(null, true);
            }
            else{
                callback(badRequestResponse("Not allowed by CORS"));
            }

    },
    methods: ["GET", "POST", "PUT"]
}
       return corsOption;
}