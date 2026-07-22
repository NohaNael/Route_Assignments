import { findbyid, findone } from "../DB/db.repo.js";
import User from "../DB/models/user.model.js";
import TokenModel from "../DB/models/token.model.js";
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

    let decoded;
    // Try user signature first, then admin — so both work without needing to specify role upfront
    const userSignature = getsignature(signarureEnum.user);
    const adminSignature = getsignature(signarureEnum.admin);
    const signaturesOrder = signatureLevel === signarureEnum.admin
        ? [adminSignature, userSignature]
        : [userSignature, adminSignature];

    for (const sig of signaturesOrder) {
        try {
            decoded = verifyToken(
                token,
                tokenType === tokenTypeEnum.ACCESS
                    ? sig.accessSignature
                    : sig.refreshSignature
            );
            break;
        } catch (_) {
            // try next signature
        }
    }

    if (!decoded) {
        throw unauthorizedResponse("Invalid or expired token");
    }
    if (await findone({ model: TokenModel, filter: { jti: decoded.jti } })) {
        throw unauthorizedResponse("Token has been revoked");
    }

    const user = await findbyid({ model: User, id: decoded.id });

    if (!user) {
        throw notFoundResponse("user not found");
    }
    if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat *1000)
        throw unauthorizedResponse("Token is invalid due to credential change");

    return { user, decoded };
};

export const authentication = ({tokenType = tokenTypeEnum.ACCESS, signatureLevel = signarureEnum.user} = {}) => {
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
