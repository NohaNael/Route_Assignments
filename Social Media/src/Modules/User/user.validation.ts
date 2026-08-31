import {z} from "zod";

export const userIdParamsSchema = {
    params: z.object({
        userID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
    })
};

export const RequestIdParamsSchema = {
    params: z.object({
        requestID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid request ID"),
    })
};