import {z} from "zod";

export const createPostSchema = {
    body: z.object({
        content: z.string().min(1, "Content cannot be empty"),
    })
};