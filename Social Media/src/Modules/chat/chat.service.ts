import { Request, Response } from "express";
import { ConversationalModel } from "../../DB/models/conversational.model.js";
import { MessageModel } from "../../DB/models/message.model.js";


export class ChatService{
    constructor(){}

    listConversation=async(req:Request,res:Response):Promise<Response> =>{
        const {page,limit}=req.query as unknown as {page:number;limit:number}
        const skip=(page-1)*limit
        const [conversations,total]=await Promise.all([
            ConversationalModel.find({participants:req.user!._id})
                .sort({updatedAt:-1})
                .skip(skip)
                .limit(limit)
                .populate("participants"),
            ConversationalModel.countDocuments({participants:req.user!._id})
        ])

        const data = conversations.map((conversation)=>{
            const other=(
                conversation.participants as unknown as Array <{
                    _id:{toString():string};

                }>
            ).find((participants)=>{
                return participants._id.toString()!==req.user!._id.toString()
            })
            return {
                _id:conversation._id,
                user:other,
                lastMessage: conversation.lastMessage,
                lastMessageAt:conversation.lastMessageAt
            }
        })
        return res.status(200).json({
            message:"Success",
            data:{
                conversations:data,
                pagination:{page,limit,total,pages:Math.ceil(total/limit)}
            }
        })
    }

    getMessage=async(req:Request,res:Response):Promise<Response> =>{
        const {userId}= req.params as {userId:string}
        const {page,limit}=req.query as unknown as {
            page:number;
            limit:number
        }
        const skip = (page-1)*limit
        const conversation= await ConversationalModel.findOne({
            participants:{$all:[req.user!._id,userId]},

        })

        if (!conversation){
            return res.status(200).json({

                message:"Success",
                data:{
                    messages:[],
                    pagination:{
                        page,limit,total:0,pages:0
                    }
                }
            })
        }
        const filter ={conversationaId:conversation._id}

        const [messages,total]= await Promise.all([
            MessageModel.find(filter)
                .sort({createdAt:-1})
                .skip(skip)
                .limit(limit)
                .populate("senderId"),
            MessageModel.countDocuments(filter)
        ])
        return res.status(200).json({
            message:"Success",
            data:{
                conversationID:conversation._id,
                messages:messages,
                pagination:{
                    page,limit,total,pages:Math.ceil(total/limit)
                }
            }
        })
    }

    unreadCount=async(req:Request,res:Response):Promise<Response> =>{

        const unread= await MessageModel.countDocuments({
        receiverId:req.user!._id,
        readAt:{$exists:false}
    })



       return res.status(200).json({
            message:"Success",
            data:{
                messages:unread,
            },
        });
    };
}

export default new ChatService()