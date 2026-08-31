import {z} from "zod";
import { RequestIdParamsSchema, userIdParamsSchema } from "./user.validation";

 
export type IUserIdParamsDTO = z.infer<typeof userIdParamsSchema.params>;
export type IRequestIdParamsDTO = z.infer<typeof RequestIdParamsSchema.params>;



