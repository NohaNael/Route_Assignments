import { Schema, Model, Types, model } from "mongoose";

export interface IPost {
    _id?: Types.ObjectId;
  content?: string;
  createdBy: Types.ObjectId;
  likes?: Types.ObjectId[];
  attachments?: string[];
  comments?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  freezeAT?: Date;
}

export const postSchema = new Schema<IPost>({
  content: { type: String, required: function(this:IPost) { return ! this.attachments?.length } },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attachments: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  freezeAT: { type: Date },
}
, { timestamps: true });

postSchema.index({ createdBy: 1, createdAt: -1 });

export const PostModel : Model<IPost> =model<IPost>("Post", postSchema);

