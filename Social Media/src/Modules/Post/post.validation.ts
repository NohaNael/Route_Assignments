import {z} from "zod";

export const createPostSchema = {
    body: z.object({
        content: z.string().min(1, "Content cannot be empty"),
    })
};



export const postIdParamsSchema = {
    params: z.object({
        postID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID"),
    })

};

export const updatePostSchema = {
    body: z.object({
        content: z.string().min(1, "Content cannot be empty"),
    }),
    params: z.object({
        postID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID"),
    })
};

export const deletePostSchema = {
    params: z.object({
        postID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID"),
    })
};

export const CreateCommentSchema = {
    body: z.object({
        content: z.string().trim().min(1, "Content cannot be empty"),
        parentCommentID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid parent comment ID").optional(),
    }),
    params: z.object({
        postID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid post ID"),
    })
};

export const updateCommentSchema = {
    body: z.object({
        content: z.string().trim().min(1, "Content cannot be empty"),
    }),
    params: z.object({

        commentID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
    })
};

export const CommentIdParamSchema = {
    params: z.object({
        commentID: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
    })
};
