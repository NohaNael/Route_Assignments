import { PostModel } from "../../DB/models/post.model";
import { badRequestException, forbidden, notFoundException } from "../../Utils/response/error.response";
import { ICommentParamsDTO, ICreateCommentDTO, ICreatePostDTO, IPostParamsDTO, IUpdateCommentDTO, IUpdatePostDTO } from "./post.dto";
import { Request, Response } from "express";
import { commentModel } from "../../DB/models/comment.model";
import { notificationEvent } from "../../Utils/events/notification.event";
import { Types } from "mongoose";



class PostService {
    constructor() {}

    createPost=async(req:Request,res:Response)=>{
        const {content}:ICreatePostDTO=req.body;

        const files=req.files as Express.Multer.File[] | undefined;

        if(!content && files?.length){
            throw new badRequestException("Post content or attachments are required");
        }

        const post=await PostModel.create({
            ...(content && {content}),
            ...(files?.length &&  {attachments:files.map((file)=>file.path)}),
            createdBy:req.user!._id
        });
        return res.status(201).json({message:"Post created successfully",post});
    }

    

    toggleLikePost=async(req:Request,res:Response):Promise<Response> =>{
       const {postID}:IPostParamsDTO=req.params as {postID:string};

        const userID=req.user!._id;


        const post=await PostModel.findOne({_id:postID,freezeAT:{$exists:false}
    });
    if (!post){
        throw new badRequestException("Post not found or freezed");
    }

    const isLiked=post.likes?.some((id)=>id.equals(userID));
    const updated=await PostModel.findByIdAndUpdate(postID,isLiked?{$pull:{likes:userID}}:{$addToSet:{likes:userID}},{new:true});
    if(!isLiked){
        notificationEvent.emit('postLiked',{to:post.createdBy,sender:req.user!,postID:post._id});
    }

    return res.status(200).json({message:isLiked?"Post unliked successfully":"Post liked successfully",post:updated});

}


updatePost=async(req:Request,res:Response):Promise<Response> =>{

    const {postID}:IPostParamsDTO=req.params as {postID:string};
    const {content}:IUpdatePostDTO=req.body;
     const post=await PostModel.findOneAndUpdate({_id:postID,createdBy:req.user!._id},{content},{new:true});

    if (!post)
        throw new forbidden("You are not authorized to update this post or post not found");
 


    return res.status(200).json({message:"Post updated successfully",post});

}

deletePost=async(req:Request,res:Response):Promise<Response> =>{

    const {postID}:IPostParamsDTO=req.params as {postID:string};
    
     const post=await PostModel.findOneAndDelete({_id:postID,createdBy:req.user!._id});

    if (!post)
        throw new forbidden("You are not authorized to update this post or post not found");
 


    return res.status(200).json({message:"Post deleted successfully",post});

}

addComment=async(req:Request,res:Response):Promise<Response> =>{

    const {postID}:IPostParamsDTO=req.params as {postID:string};
    const {content, parentCommentID}:ICreateCommentDTO=req.body;

    const post=await PostModel.findOne({_id:postID,freezeAT:{$exists:false}});

    if (!post){
        throw new notFoundException("Post not found or frozen");
    }
    let parentAuthor:Types.ObjectId | undefined;

    if(parentCommentID){
        const parentComment=await commentModel.findOne({_id:parentCommentID,postId:postID});
        if(!parentComment){
            throw new badRequestException("Parent comment not found");
        }
        parentAuthor=parentComment.createdBy
    }

    const newComment=await commentModel.create({
        postId:postID,
        content,
        ...(parentCommentID && {parentID:parentCommentID}),
        createdBy:req.user!._id
    });
    if(parentAuthor){
        notificationEvent.emit('postCommented',{to:parentAuthor,sender:req.user!,postID:post._id,commentID:newComment._id,content});
    }
    else    {
        notificationEvent.emit('postCommented',{to:post.createdBy,sender:req.user!,postID:post._id,commentID:newComment._id,content});
    }



    return res.status(201).json({message:"Comment added successfully",comment:newComment});
}

updateComment=async(req:Request,res:Response):Promise<Response> =>{

    const {commentID}:ICommentParamsDTO=req.params as {commentID:string};
    const {content}:IUpdateCommentDTO=req.body;

    const comment=await commentModel.findOneAndUpdate({_id:commentID,createdBy:req.user!._id},{content},{new:true});

    if (!comment){
        throw new forbidden("You are not authorized to update this comment or comment not found");
    }

    return res.status(200).json({message:"Comment updated successfully",comment});
}



deleteComment=async(req:Request,res:Response):Promise<Response> =>{

    const {commentID}:ICommentParamsDTO=req.params as {commentID:string};  
    const userID=req.user!._id;

    const comment=await commentModel.findById({_id:commentID});
    if(!comment){
        throw new notFoundException("Comment not found");
    }

    const post=await PostModel.findById({_id:comment.postId});

    const isAuthorized=comment.createdBy.equals(userID)
    const isPostOwner=post?.createdBy.equals(userID)

    if(!isAuthorized && !isPostOwner){
        throw new forbidden("You are not authorized to delete this comment");
    }

    await Promise.all([
        commentModel.deleteOne({_id:commentID}),
        commentModel.deleteMany({parentID:commentID})
    ]);
   
    return res.status(200).json({message:"Comment deleted successfully",comment});
}
}
export default new PostService();