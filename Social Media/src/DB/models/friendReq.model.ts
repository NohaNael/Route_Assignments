import {HydratedDocument,Model,model,Types,Schema} from "mongoose";

export interface IFriendReq {
    _id?:Types.ObjectId;
    sentBy:Types.ObjectId;
    sentTo:Types.ObjectId;
    status:"pending"|"accepted"|"rejected";
    createdAt?:Date;
    updatedAt?:Date;
}

export const friendReqSchema=new Schema<IFriendReq>({
    sentBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
    sentTo:{type:Schema.Types.ObjectId,ref:"User",required:true},
    status:{type:String,enum:["pending","accepted","rejected"],default:"pending"}

},
{timestamps:true});

friendReqSchema.index({sentdBy:1,sentTo:-1});

export const FriendReqModel:Model<IFriendReq>=model<IFriendReq>("FriendReq",friendReqSchema);

export type IFriendReqDocument=HydratedDocument<IFriendReq>;
