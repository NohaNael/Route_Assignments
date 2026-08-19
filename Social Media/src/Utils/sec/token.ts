import {JwtPayload, Secret,sign,SignOptions,verify} from "jsonwebtoken";
import { HUserDoc, userModel } from "../../DB/models/user.model";
import { Roleenum } from "../enums/user.enum";
import { env } from "../../config/config.service";
import { tokentypeEnum } from "../enums/user.enum";
import { UnauthorizedException } from "../response/error.response";

export const generateToken = async ({payload, secret, options}:{payload:object, secret:Secret, options:SignOptions}) => {
    return sign(payload, secret, options);

}
export interface ITokenPayload extends JwtPayload {
    id:string;
    role:Roleenum;
}


export const verifyToken = async ({token, secret}:{token:string, secret:Secret}) :Promise<ITokenPayload> => {
    return verify(token, secret) as ITokenPayload;
}
const getsignature = (type:tokentypeEnum, role:Roleenum) : string => {
    const Isadmin = role === Roleenum.Admin;
    if(type === tokentypeEnum.access){
        return Isadmin ? process.env.Access_admin_signature as string : process.env.Access_user_signature as string;
    }else{
        return Isadmin ? process.env.Refresh_admin_signature as string : process.env.Refresh_user_signature as string;
    }
 }

export const createLoginCredentials = async (

    user:HUserDoc,
)  : Promise<{accessToken:string;
     refreshToken:string}> => {

    const accesssecret = getsignature(tokentypeEnum.access, user.role);
    const refreshsecret = getsignature(tokentypeEnum.refresh, user.role);

    const accessToken = await generateToken({
        payload:{id:user._id, role:user.role},
        secret:accesssecret as Secret,
        options:{expiresIn:env.Access_token_expiration as any}
    });


    const refreshToken = await generateToken({
        payload:{id:user._id, role:user.role},
        secret:refreshsecret as Secret,
        options:{expiresIn:env.Refresh_token_expiration as any}
    });

    return {accessToken, refreshToken};
}

export const decodedtoken= async ({
    authorization,
    tokentype=tokentypeEnum.access

}: {
    authorization:string|undefined;
    tokentype?:tokentypeEnum;
}): Promise<{user:HUserDoc, decoded:ITokenPayload}> => {
    if(!authorization){
        throw new UnauthorizedException("No token provided");
    }

    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer" || !token){
        throw new UnauthorizedException("Invalid token format");
    }


    let decoded:ITokenPayload;
    try{
        decoded = await verifyToken({token, secret:getsignature(tokentype, Roleenum.User)});
    }catch(err){
        throw new UnauthorizedException((err as Error).message ?? "Invalid token");
    }

    const user = await userModel.findById(decoded.id);
    if(!user){
        throw new UnauthorizedException("User not found");
    }
    return {user, decoded};
}

