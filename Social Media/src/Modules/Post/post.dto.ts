import {z} from "zod";
import { createPostSchema, postIdParamsSchema, updatePostSchema,deletePostSchema, CreateCommentSchema, updateCommentSchema, CommentIdParamSchema } from "./post.validation";

export type ICreatePostDTO = z.infer<typeof createPostSchema.body>;
export type IPostParamsDTO = z.infer<typeof postIdParamsSchema.params>;
export type IUpdatePostDTO = z.infer<typeof updatePostSchema.body> 
export type IDeletePostDTO = z.infer<typeof deletePostSchema.params>;
export type ICreateCommentDTO = z.infer<typeof CreateCommentSchema.body>;
export type IUpdateCommentDTO = z.infer<typeof updateCommentSchema.body>;
export type ICommentParamsDTO = z.infer<typeof CommentIdParamSchema.params>;