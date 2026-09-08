import { ConversationalModel } from "../../DB/models/conversational.model.js"
import { AuthSocket } from "./socket.service.js"
import {Server} from  "socket.io";
import { MessageModel } from "../../DB/models/message.model.js";
import { Types } from "mongoose";
import { HUserDoc, userModel } from "../../DB/models/user.model.js";
import { badRequestException, forbidden, notFoundException } from "../response/error.response.js";
import * as validators from "../../Modules/chat/chat.valid.js"
import { handleEvent } from "./socket.helper.js";
import { isuseronline } from "./connected.users.js";


const getchatpartner= async(me:HUserDoc,otherId:string):Promise<HUserDoc> =>{
    if(otherId===me._id.toString())
        throw new badRequestException("you cant chat")
    const other=await userModel.findById(otherId)
    if(!other) throw new notFoundException("user not found")

    const iBlockedHim=me.blockedUsers?.some((id)=>id.equals(other._id));
    const heblockedme=other.blockedUsers?.some((id)=>id.equals(me._id))

    if(iBlockedHim || heblockedme)
        throw new forbidden("you cant message this user")

    if(!me.friends?.some((id)=>id.equals(other._id)))
        throw new forbidden("you cant message this user")

    return other;
}
const findorcreateconversation= async(
    userA:Types.ObjectId,userB:Types.ObjectId)=>{
    
    return ConversationalModel.findOneAndUpdate({participants:{$all:[userA,userB]}},

      {$setOnInsert:{participants:[userA,userB]}},
      {upsert:true,new:true}

    )}
   
export const registerChatEvents=(io:Server, socket:AuthSocket):void=>{
    const user= socket.user!;
    const userId= user?._id.toString()

    socket.on("sendMessage",
        handleEvent(socket,"sendMessage",validators.sendMessageSchema,async(data)=>{
            const receiver= await getchatpartner(user, data.to)

        
            const conversation= await findorcreateconversation(
                new Types.ObjectId(user._id),
                new Types.ObjectId(receiver._id),
            )

           const message= await MessageModel.create({
                conversationID:conversation?._id,
                senderID:user._id,
                receiverID:data.to,
                content:data.content,
            })

            await ConversationalModel.updateOne(
                {_id:conversation?._id},
                {lastMessage:data.content, lastMessageAt:new Date(), lastMessageBy:user._id}
            );

            const payload={
                _id:message._id,
                conversationId:conversation._id,
                content:message.content,
                createdAt:message.createdAt,
                receiverId:receiver._id,
                sender:{
                    _id:user._id,
                    firstname:user.firstname,
                    lastname:user.lastname
                }
            }


            io.to(data.to).emit("newMessage",payload)

            io.to(userId).emit("messageSent",{...payload,deliverd:isuseronline(data.to)

            })
        }))

                
    
    socket.on("typing",handleEvent(socket,"typing",validators.typingSchema,(data)=>{
        io.to(data.to).emit("userTyping",{userId,firstname:user.firstname})
    }))

    socket.on("stopTyping",handleEvent(socket,"stopTyping",validators.typingSchema,(data)=>{
        io.to(data.to).emit("userStopTyping",{
            userId,firstname:user.firstname
        })
    }))

    socket.on("markedasRead",async(data:any)=>{
        const readAt=new Date()
        const results= await MessageModel.updateMany({
            senderID:data.from,
            receiverID:user._id,
            readAt:{$exists:false}
        },
        {readAt}
        );
        if(results.modifiedCount>0){
            io.to(data.from).emit("messageRead",{
                by:userId,
                readAt,
                count:results.modifiedCount,
            })
        }
    })
}