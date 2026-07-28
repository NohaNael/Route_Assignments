import { findone, create, findbyid } from '../../DB/db.repo.js';
import User from '../../DB/models/user.model.js';
import Message from '../../DB/models/msg.model.js';
import { successResponse } from '../../utils/success.response.js';
import { notFoundResponse } from '../../utils/err.response.js';
import { Types } from 'mongoose';


export const sendMessage = async (req, res) => {
    const { receiverID } = req.params;
    const { content } = req.body;
    

   const receiver=await findone({ model: User, filter: { _id: receiverID , freezedAT:{$exists:false}} });
   if (!receiver) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  const message = await create({ model: Message, data: { content, receiverID } });

  successResponse({ res, statusCode: 201, message: "Message sent successfully", data: message });


}

export const getMessages = async (req, res) => {


    const {page=1,limit=10}=req.query;
    const receiverID=req.user._id;
    const skip = (page - 1) * limit;
    
    const [messages, totalMessage] = await Promise.all([
        Message.find({ receiverID }).skip(Number(skip)).limit(Number(limit)).sort({ createdAt: -1 }),
        Message.countDocuments({ receiverID })
    ]);

    successResponse({ res, statusCode: 200, message: "Messages retrieved successfully", data: { messages, pagination:{currentPage:Number(page), totalPages:Math.ceil(totalMessage/limit) , totalMessage}} });
}


export const toggleRead=async (req,res)=>{
    const {messageID}=req.params;
    const receiverID=req.user._id;
    const message=await findone({model:Message,filter:{_id:messageID}});
    if(!message)
        throw notFoundResponse("Message not found - invalid ID");
    if(message.receiverID.toString()!==receiverID.toString())
        throw notFoundResponse(`Message not found - wrong user. Message receiver: ${message.receiverID}, logged in as: ${receiverID}`);
    
    message.isRead=!message.isRead;
    await message.save();


    successResponse({ res, statusCode: 200, message: "Message read status toggled successfully", data: message });
}


export const toggleFav=async (req,res)=>{
    const {messageID}=req.params;
    const receiverID=req.user._id;
    const message=await findone({model:Message,id:messageID});
    if(!message||message.receiverID.toString()!==receiverID.toString())
        throw notFoundResponse(`Message not found - wrong user. Message receiver: ${message?.receiverID}, logged in as: ${receiverID}`);
    
    message.isfavorite=!message.isfavorite;
    await message.save();

    successResponse({ res, statusCode: 200, message: "Message favorite status toggled successfully", data: message });
}