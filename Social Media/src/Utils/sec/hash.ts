import { compare, hash } from "bcrypt";
import { env } from "../../config/config.service";




export const generateHash = async (plain_text: string,saltRounds:number=env.SALT_ROUND): Promise<string> => {

    return await hash(plain_text, saltRounds);
};


export const compareHash = async (plain_text: string, hashval:string): Promise<boolean> => {

    return await compare(plain_text, hashval);
};
