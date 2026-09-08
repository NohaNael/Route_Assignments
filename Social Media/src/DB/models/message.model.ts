import {HydratedDocument, model, Model, Schema, Types} from 'mongoose';

export interface IMessage{
    _id:Types.ObjectId
    senderID:Types.ObjectId
    receiverID:Types.ObjectId
    content:string
    readAt:Date
    createdAt:Date
    updatedAt?:Date
    conversationID:Types.ObjectId

}


export const messageSchema= new Schema<IMessage>(
    {
        content:{
            type:String,
            minlength:1,
            maxlength:7000,
            required:true
        },
        senderID:{type:Schema.Types.ObjectId, ref:"user", required:true},
        receiverID:{type:Schema.Types.ObjectId, ref:"user", required:true},
        conversationID:{type:Schema.Types.ObjectId, ref:"conversation", required:true},
        readAt:{type:Date}

    },
    {timestamps:true}
)

messageSchema.index({conversationID:1,createdAt:-1})
messageSchema.index({receivedAt:1,readAt:-1})

messageSchema.pre("validate",async function(){
    if(this.content) this.content=this.content.trim()
})

export const MessageModel:Model<IMessage>=model<IMessage>
(
    "Message",
    messageSchema
);
export type HMessageDocuments=HydratedDocument<IMessage>;    


