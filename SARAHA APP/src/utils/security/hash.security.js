import { SALTROUNDS } from "../../../config/config.service.js";
import { hashenum } from "../enums/sec.enum.js";
import * as argon2 from "argon2";
import { badRequestResponse } from "../err.response.js";

export const generateHash = async({plain_text, saltRounds=Number(SALTROUNDS), algorithm=hashenum.BCRYPT}) => {

    let hash="";
    switch(algorithm){
        case hashenum.BCRYPT:   
            const bcrypt = await import("bcrypt");
            hash = await bcrypt.hash(plain_text, saltRounds);
            break;


        case hashenum.ARGON2:
            hash = await argon2.hash(plain_text);
            break;
        default:
            throw badRequestResponse("Unsupported hashing algorithm");
    }
    return hash;
}

export const compareHash = async({plain_text, cipher_text, algorithm=hashenum.BCRYPT}) => {


    let isMatch=false;  
    switch(algorithm){
        case hashenum.BCRYPT:
            const bcrypt = await import("bcrypt");
            isMatch = await bcrypt.compare(plain_text, cipher_text);
            break;  
        case hashenum.ARGON2:
            isMatch = await argon2.verify(cipher_text, plain_text);
            break;
        default:
            throw badRequestResponse("Unsupported hashing algorithm");
    }   
    return isMatch;
}
