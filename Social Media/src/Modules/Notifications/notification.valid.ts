import {z} from "zod"




export const deviceTokenSchema={

    body:z.strictObject({
        token:z.string({ error: "Device token is required"}).min(50,{error:"invalid device token"}).max(4096)
    })
}

export const listnots={
    query:z.object({
        page:z.coerce.number().int().min(1).default(1),
        limit:z.coerce.number().int().min(1).max(20).default(1),
        unreadonly:z.enum(["true","false"]).default("false")
    })
}

export const notificationParamsSchema={
    params:z.object({
        notificationId:z.string().regex(/^[0-9a-fA-F]{24}$/, {error:"invalid id format"}),
    }),
}