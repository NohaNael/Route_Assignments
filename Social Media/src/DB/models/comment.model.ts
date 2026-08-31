import {Model,model,Types,Schema} from "mongoose";
import type {HydratedDocument} from "mongoose";

export interface IComment {
    _id?:Types.ObjectId;
    postId:Types.ObjectId;
    parentID:Types.ObjectId;
    content:string;
    createdBy:Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

export const commentSchema=new Schema<IComment>({

    content:{type:String,required:true

    },
    postId:{type:Schema.Types.ObjectId,ref:"Post",required:true},
    parentID:{type:Schema.Types.ObjectId,ref:"Comment",default:null},
    createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true}

},

{timestamps:true});




commentSchema.index({postId:1,createdAt:-1});
export const commentModel:Model<IComment>=model<IComment>("Comment",commentSchema);
export type HCommentDocument=HydratedDocument<IComment>;