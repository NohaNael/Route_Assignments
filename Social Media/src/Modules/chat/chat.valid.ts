import {z} from "zod";

export const sendMessageSchema= z.object({
    to:z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid id format"}),

    content:z 
    .string({error:"message content req"})
    .trim()
    .min(1)
    .max(500000),

})

export const typingSchema= z.object({
    to:z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid id format"}),
})

export const emptySchema=z.unknown()
export const conversationalSchema={
    query:z.object({
        page:z.coerce.number().int().min(1).default(1),
        limit:z.coerce.number().int().min(1).max(40).default(1)
    
    })
}

export const getMessageSchema= {
    params:z.strictObject({
        userId:z.string()
        .regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid id format"}),
    }),
    query:z.object({
        page:z.coerce.number().int().min(1).default(1),
        limit:z.coerce.number().int().min(1).max(40).default(1)
    
    }),

}
export const markasread= z.object({
    to:z.string().regex(/^[0-9a-fA-F]{24}$/,{error:"Invalid id format"}),
})
