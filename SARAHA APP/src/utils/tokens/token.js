import jwt from "jsonwebtoken";
import { Access_Token_Secret_Admin, Access_Token_Secret_User, REFRESH_TOKEN_Secret_Admin, REFRESH_TOKEN_Secret_User } from "../../../config/config.service.js";
import { signarureEnum, UserRole } from "../enums/user.enum.js";
import { v4 as uuidv4 } from 'uuid';


export const generateToken = ({payload, signature, options={expiresIn: "1h"}}) => {
    if (!signature) {
        throw new Error("JWT secret is missing");
    }

    return jwt.sign(payload, signature, options);
}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);   
}


export const getsignature = (signatureLevel=signarureEnum.user) => {

    let signature={accessSignature: null, refreshSignature: null};

    switch(signatureLevel){
        case signarureEnum.admin:
            signature.accessSignature=Access_Token_Secret_Admin;
            signature.refreshSignature=REFRESH_TOKEN_Secret_Admin;
            break;
        case signarureEnum.user:
            signature.accessSignature=Access_Token_Secret_User;
            signature.refreshSignature=REFRESH_TOKEN_Secret_User;
            break;
        default:
            signature.accessSignature=Access_Token_Secret_User;
            signature.refreshSignature=REFRESH_TOKEN_Secret_User;
            break;
    }
        console.log("SIGNING USER SECRET:", signature.accessSignature);

    return signature;

}


export const getNewloginCredentials = (user) => {

    const isAdmin = Number(user.role) === UserRole.ADMIN;

    const signature = getsignature(
        isAdmin ? signarureEnum.admin : signarureEnum.user
    );

    const jwtid = uuidv4(); // Generate a unique identifier for the token

    const accessToken = generateToken({
        payload: { id: user._id },
        signature: signature.accessSignature,
        options: { expiresIn: isAdmin ? "30m" : "1h" ,jwtid }  // Add jti claim with a unique identifier
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature: signature.refreshSignature,
        options: { expiresIn: isAdmin ? "1d" : "7d", jwtid}  // Add jti claim with a unique identifier
    });

    return { accessToken, refreshToken };
};
