import { Schema, Types } from 'mongoose';
import {model,Model,HydratedDocument} from "mongoose";


export enum NotificationTypeEnum {

    friendRequest = 'friendRequest',
    friendRequestAccepted = 'friendRequestAccepted',
    friendRequestRejected = 'friendRequestRejected',
    postLiked = 'postLiked',
    'postCommented' = 'postCommented',
    'commentReply' = 'commentReply',
}

export interface INotification {

    _id:Types.ObjectId;
    userId:Types.ObjectId;
    senderId:Types.ObjectId;
    type:NotificationTypeEnum;
    title:string;
    body:string;
    postId?:Types.ObjectId;
    commentId?:Types.ObjectId;
    requestId?:Types.ObjectId;
    readat?:Date;
    createdAt:Date;
    updatedAt:Date;
    
}

export const NotificationSchema=new Schema<INotification>({

    postId:{type:Schema.Types.ObjectId,ref:"Post",required:true},
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    senderId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,enum:Object.values(NotificationTypeEnum),required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
    readat:{type:Date,default:null},
    createdAt:{type:Date,default:null},
    commentId:{type:Schema.Types.ObjectId,ref:"Comment",default:null},
    requestId:{type:Schema.Types.ObjectId,ref:"FriendRequest",default:null},

},

{timestamps:true});

NotificationSchema.index({userId:1,createdAt:-1});
NotificationSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*30}); // 30 days

export const NotificationModel: Model<INotification>=model<INotification>("Notification",NotificationSchema);

export type HNotificationDocument=HydratedDocument<INotification>;
