import { HydratedDocument, Schema, model, Types } from "mongoose"


export interface Iconversation {
    _id:Types.ObjectId
    participants:Types.ObjectId[]
    lastMessage?:string
    lastMessageAt?:Date
    lastMessageBy?:Types.ObjectId
    createdAt:Date
    updatedAt:Date

}

export const ConversationSchema= new Schema <Iconversation>(
    {
        participants:[{
            type:Schema.Types.ObjectId, ref:"User",required:true

        }],
        
        lastMessage:{type:String},
        lastMessageAt:{type:Date},
        lastMessageBy:{type:Types.ObjectId}
    },
    {timestamps:true},
    
)

export const ConversationalModel = model<Iconversation>(
    "Conversation",
    ConversationSchema
)
export type HConversationDocuments = HydratedDocument<Iconversation>


