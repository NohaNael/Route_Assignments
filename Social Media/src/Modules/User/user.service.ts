import { badRequestException, forbidden, conflictException, notFoundException } from "../../Utils/response/error.response";
import {IUserIdParamsDTO} from "./user.dto";
import {Request, Response} from "express"
import {userModel} from "../../DB/models/user.model";
import {FriendReqModel} from "../../DB/models/friendReq.model";
import { notificationEvent } from "../../Utils/events/notification.event";

class UserService {
    constructor()

            {}

        sendFriendRequest=async(req:Request,res:Response):Promise<Response> => {
            const {userID}:IUserIdParamsDTO=req.params as {userID:string};

            const senderID=req.user!._id;
            if(userID===senderID.toString()){
                throw new badRequestException("You cannot send a friend request to yourself");
            }

            const target=await userModel.findById(userID);
            if(!target){
                throw new badRequestException(" user not found");
            }

            if(target.blockedUsers?.some(id=>id.equals(senderID)|| req.user?.blockedUsers?.some(id=>id.equals(target._id)))){
                throw new forbidden("You cannot send a friend request to this user");
            }

            if(target.friends?.some(id=>id.equals(senderID))){
                throw new conflictException("You are already friends with this user");
            }

            const existing=await FriendReqModel.findOne({$or:[{sentBy:senderID,sentTo:userID},{sentBy:userID,sentTo:senderID}]});

            if(existing){
                throw new conflictException("A friend request already exists between you and this user");
            }
            const friendRequest=await FriendReqModel.create({sentBy:senderID,sentTo:userID});

            notificationEvent.emit('sendNotification', {
                to: target._id,
                sender: {
                    _id: req.user!._id,
                    firstName: req.user!.firstname,
                    lastName: req.user!.lastname,
                },
                requestID: friendRequest._id,
            });

            return res.status(201).json({message:"Friend request sent successfully",friendRequest});

        
        }

        listFriendRequests=async(req:Request,res:Response):Promise<Response> => {
            const friendRequest= await FriendReqModel.find({sentTo:req.user!._id}).populate("sentBy","firstname lastname email").lean();
            const existing= await FriendReqModel.findOne({sentBy:req.user!._id,sentTo:req.user!._id});
            if(existing){
                throw new conflictException("A friend request already exists between you and this user");
            }
            return res.status(200).json({message:"Friend requests retrieved successfully",friendRequest});
        }

        acceptFriendRequest=async(req:Request,res:Response):Promise<Response> => {
            const {requestID}=req.params as {requestID:string};
            const friendRequest=await FriendReqModel.findOne({_id:requestID,sentTo:req.user!._id});

            if(!friendRequest){
                throw new badRequestException("Friend request not found");
            }

            await Promise.all([
                userModel.updateOne({_id:friendRequest.sentBy.toString()},{$addToSet:{friends:friendRequest.sentTo}}),
                userModel.updateOne({_id:friendRequest.sentTo.toString()},{$addToSet:{friends:friendRequest.sentBy}}),
            ]);
            await FriendReqModel.deleteOne({_id:requestID});

            return res.status(200).json({message:"Friend request accepted successfully",friendRequest});
        }

        rejectFriendRequest=async(req:Request,res:Response):Promise<Response> => {
            const {requestID}=req.params as {requestID:string};
            const friendRequest=await FriendReqModel.findOneAndDelete({_id:requestID,$or:[{sentTo:req.user!._id},{sentBy:req.user!._id}]});
            
            if(!friendRequest){
                throw new badRequestException("Friend request not found");
            }
            return res.status(200).json({message:"Friend request rejected successfully",friendRequest});
        }


        removeFriend=async(req:Request,res:Response):Promise<Response> => {
            const {userID}=req.params as {userID:string};
            const myID=req.user!._id;

            await Promise.all([
                userModel.updateOne({_id:myID},{$pull:{friends:userID}}),
                userModel.updateOne({_id:userID},{$pull:{friends:myID}}),
            ]);

            return res.status(200).json({message:"Friend removed successfully"});
        }

        blockUser=async(req:Request,res:Response):Promise<Response> => {
            const {userID}=req.params as {userID:string};
            const myID=req.user!._id;
            if(userID===myID.toString()){
                throw new badRequestException("You cannot block yourself");
            }

            const target=await userModel.findById(userID);
            if(!target){
                throw new notFoundException("User not found");
            }

            await Promise.all([
                userModel.updateOne({_id:myID},{$addToSet:{blockedUsers:userID},$pull:{friends:userID}}),
                userModel.updateOne({_id:userID},{$pull:{friends:myID}}),
                FriendReqModel.deleteMany({$or:[{sentBy:myID,sentTo:userID},{sentBy:userID,sentTo:myID}]})
            ]);

            return res.status(200).json({message:"User blocked successfully"});

        }

        UnblockUser=async(req:Request,res:Response):Promise<Response> => {
            const {userID}=req.params as {userID:string};
           
            const updated=await userModel.updateOne({_id:req.user!._id},{$pull:{blockedUsers:userID}});
            if(!updated)
                throw new badRequestException("User not found or not blocked");

            return res.status(200).json({message:"User blocked successfully"});

        }
    
}
        export default new UserService();
        
