import { Request,Response, NextFunction } from "express";
import { decodedtoken } from "../Utils/sec/token";
import { Roleenum, tokentypeEnum } from "../Utils/enums/user.enum";
import { forbidden } from "../Utils/response/error.response";


export const authentication = (tokentype = tokentypeEnum.access) => {
    return async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            const { user, decoded } = await decodedtoken({
                authorization: req.headers.authorization,
                tokentype,
            });

            req.user = user;
            req.decoded = decoded;
            return next();
        } catch (err) {
            return next(err);
        }
    };
};


export const authorization = ({roles = []} : {roles?: Roleenum[]} = {}) => {
    return async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        if (!roles.length || !roles.includes(req.decoded.role)) {
            throw new forbidden("You do not have permission to perform this action");
        }
        next();
    };
};
