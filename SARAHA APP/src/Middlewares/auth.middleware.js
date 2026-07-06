import { findbyid } from "../DB/db.repo.js";
import User from "../DB/models/user.model.js";
import { forbiddenResponse, notFoundResponse, unauthorizedResponse } from "../utils/err.response.js";
import { signarureEnum } from "../utils/enums/user.enum.js";
import { verifyToken, getsignature } from "../utils/tokens/token.js";
import {Access_Token_Secret_User} from "../../config/config.service.js";
export const tokenTypeEnum = {
    ACCESS: "access",
    REFRESH: "refresh",
};

export const decodedToken = async ({
    authorization,
    tokenType = tokenTypeEnum.ACCESS,
    signatureLevel = signarureEnum.user
} = {}) => {

    if (!authorization) {
        throw unauthorizedResponse("authorization is required");
    }

    const token = authorization
    ?.split(" ")[1]
    ?.replace(/[\r\n]+/g, "")
    ?.trim();

if (!token) {
    throw unauthorizedResponse("authorization token is required");
}

    if (!token) {
        throw unauthorizedResponse("authorization token is required");
    }

    const signature = getsignature(signatureLevel);
    console.log("TOKEN TYPE:", tokenType);
    console.log("ACCESS SECRET:", signature.accessSignature);
    console.log("REFRESH SECRET:", signature.refreshSignature);

    const decoded = verifyToken(
        token,
        tokenType === tokenTypeEnum.ACCESS
            ? signature.accessSignature
            : signature.refreshSignature
    );

    const user = await findbyid({ model: User, id: decoded.id });

    if (!user) {
        throw notFoundResponse("user not found");
    }

    return { user, decoded };
};

export const authentication = (tokenType = tokenTypeEnum.ACCESS, signatureLevel = signarureEnum.user) => {
    return async (req, res, next) => {
        const { user, decoded } = await decodedToken({
            authorization: req.headers.authorization,
            tokenType,
            signatureLevel,
        });

        req.user = user;
        req.decoded = decoded;
        return next();
    };
};


console.log("VERIFY USER SECRET:", Access_Token_Secret_User);



export const authorization = ({roles = []} = {} ) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) 
            throw forbiddenResponse("You do not have permission to perform this action");
        return next();
    };

      };
