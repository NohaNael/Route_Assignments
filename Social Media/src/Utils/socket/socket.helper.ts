import { ZodType } from "zod"
import {Socket} from "socket.io"



export const handleEvent = <TSchema extends ZodType>(
    socket: Socket,
    eventName: string,
    schema: TSchema,
    handler: (data: ReturnType<TSchema["parse"]>) => Promise<unknown> | unknown,
) => {

    return async(raw:unknown):Promise<void>=>{
        try{
            const results= schema.safeParse(raw);
            if(!results.success){
                const message=results.error.issues[0]?.message??"Invalid";
                socket.emit("socketError",{events:eventName,error:message})
                return ;
            }
            await handler(results.data as ReturnType<TSchema["parse"]>)

        } catch (error){

        }
    }
}

