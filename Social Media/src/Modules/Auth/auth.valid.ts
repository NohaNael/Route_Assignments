import { z } from "zod";

export const loginSchema = {
    body: z.strictObject({
        email: z.email(),
        password: z.string().min(6).max(20),
    }),
};

export const confirmEmailSchema = {
    body: z.strictObject({
        email: z.email(),
        otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    }),
};

export const signUpSchema=  {
    body:loginSchema.body.extend({
        username: z.string().min(3).max(20),
        confirmPassword: z.string().min(6).max(20)
    })

        .superRefine((data, ctx) => {
            if (data.confirmPassword !== data.password) {
                ctx.addIssue({
                    code: "custom",
                    message: "Passwords do not match",
                    path: ["confirmPassword"],
                });
            }
        }), 
    }