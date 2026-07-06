import jwt from "jsonwebtoken";
import { Access_Token_Secret_Admin, Access_Token_Secret_User, REFRESH_TOKEN_Secret_Admin, REFRESH_TOKEN_Secret_User } from "../../../config/config.service.js";
import { signarureEnum, UserRole } from "../enums/user.enum.js";


export const generateToken = (payload, secret, options={expiresIn: "1h"}) => {
    if (!secret) {
        throw new Error("JWT secret is missing");
    }

    return jwt.sign(payload, secret, options);
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

    const accessToken = generateToken(
        { id: user._id },
        signature.accessSignature,
        { expiresIn: isAdmin ? "30m" : "1h" }
    );

    const refreshToken = generateToken(
        { id: user._id },
        signature.refreshSignature,
        { expiresIn: isAdmin ? "1d" : "7d" }
    );

    return { accessToken, refreshToken };
};
