import { z} from "zod";
import {signUpSchema,confirmEmailSchema,loginSchema} from "./auth.valid";

export type ISignUpDTO = z.infer<typeof signUpSchema.body>;

export type IconfirmEmailDTO = z.infer<typeof confirmEmailSchema.body>;

export type ILoginDTO = z.infer<typeof loginSchema.body>;;