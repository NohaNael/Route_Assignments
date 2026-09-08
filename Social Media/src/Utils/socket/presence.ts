import { Server } from "socket.io";
import { HUserDoc, userModel } from "../../DB/models/user.model";
import { addconnection, getOnlineUserIds, removeConnection } from "./connected.users";
import { AuthSocket } from "./socket.service";
import { handleEvent } from "./socket.helper";
import { ZodType } from "zod";
import { emptySchema } from "../../Modules/chat/chat.valid";





export const getFriendsOnlineIDs=(user:HUserDoc):string[]=>{
    const OnlineIds=getOnlineUserIds()
    return (user.friends ?? []).map((friendId)=>
        friendId.toString()).filter((friendId)=>OnlineIds.includes(friendId)

        )
}

const notifyFriends=(io:Server, user:HUserDoc,event:string, payload:Record<string,unknown>,):void=>{
    (user.friends ?? []).forEach((friendId)=>{
        io.to(friendId.toString()).emit(event,payload)
    })
}

export const registerPresenceEvents=(
    io:Server,
    socket:AuthSocket,

): void=>{
    const user=socket.user!;

    const userId: string = user?._id.toString();

    const isFirstDev=addconnection(userId,socket.id)
    if(!isFirstDev){
        notifyFriends(io,user,"userOnline",{
            userId,firstname:user?.firstname,
            lastname:user?.lastname,
        })
    }
     socket.emit("OnlineFriends",{friend:getFriendsOnlineIDs})
     socket.on(
        "getonlinefriends",handleEvent(socket,"getonline",emptySchema as ZodType,()=>{
            socket.emit("onlineFriends",{friend:getFriendsOnlineIDs})

        })
     )


    socket.on("disconnect",async()=>{
        console.log(`[socket] disconnected : ${user.firstname}(${socket.id})`)

        const islastdev=removeConnection(userId,socket.id)

        if(!islastdev){
            return;
        }

        const lastseen=new Date()
        await userModel.updateOne({_id:userId},{lastseen})

        notifyFriends(io,user,"userOffline",{userId,lastseen})
    })

}

