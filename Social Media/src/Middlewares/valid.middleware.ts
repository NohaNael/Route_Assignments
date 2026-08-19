import {Request, Response, NextFunction} from "express";
import type {ZodType} from "zod";
import { badRequestException } from "../Utils/response/error.response";

type keyReqtype = keyof Request;

export const validate = (schema: Partial<Record<keyReqtype, ZodType>>) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const validationError: Array<{key: keyReqtype, issues: Array<{message: string, path: (string | number | symbol)[]}>}> = [];

        for (const key of Object.keys(schema) as keyReqtype[]) {
            const keySchema = schema[key];
            if (!keySchema) continue;

            const validationResult = keySchema.safeParse(req[key]);
            if (!validationResult.success) {
                validationError.push({key, issues: validationResult.error.issues.map((issue: {message: string, path: (string | number | symbol)[]}) => ({message: issue.message, path: issue.path}))});
            }
        }

        if (validationError.length > 0) {
            return next(new badRequestException("Validation Error", 400, { cause: validationError }));
        }
        next();
    };
};