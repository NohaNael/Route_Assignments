import { PostModel } from "../../DB/models/post.model";
import { badRequestException } from "../../Utils/response/error.response";
import { ICreatePostDTO } from "./post.dto";
import { Request, Response } from "express";



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
}
    
export default new PostService();