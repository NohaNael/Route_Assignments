import {EventEmitter} from "events";
import { Types } from "mongoose";
import { sendNotification } from "../firebase/push.service";
import { NotificationTypeEnum } from "../../DB/models/notification.model";

export const notificationEvent = new EventEmitter();

interface IActor {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;

}

const fullname=(user:IActor):string=>{
     return `${user.firstName} ${user.lastName}`.trim();
}

notificationEvent.on('sendNotification', async(data:{to:Types.ObjectId, sender:IActor, requestID?:Types.ObjectId})=>{
await sendNotification({
  userId: data.to,
  senderId: data.sender._id,
  title: "New Friend Request",
  body: `${fullname(data.sender)} sent you a friend request`,
  ...(data.requestID && { requestID: data.requestID }),
  type: NotificationTypeEnum.friendRequest
});

  })

notificationEvent.on('sendNotificationAccepted', async(data:{to:Types.ObjectId, sender:IActor})=>{
    await sendNotification({
      userId: data.to,  
      senderId: data.sender._id,
      type: NotificationTypeEnum.friendRequestAccepted,
        title: "Friend Request Accepted",
        body: `${fullname(data.sender)} accepted your friend request`,
    });
  })


notificationEvent.on('postLiked', async(data:{to:Types.ObjectId, sender:IActor, postID:Types.ObjectId})=>{

 
        await sendNotification({
            userId: data.to,
            senderId: data.sender._id,
            title: "Post Liked",
            body: `${fullname(data.sender)} liked your post`,
            postID: data.postID,
            type: NotificationTypeEnum.postLiked
        });
    })
  


notificationEvent.on('postCommented', async(data:{to:Types.ObjectId, sender:IActor, postID:Types.ObjectId, commentID:Types.ObjectId,content:String})=>{
    await sendNotification({
        userId: data.to,
        senderId: data.sender._id,
        title: "New Comment",
        body: `${fullname(data.sender)} commented on your post: ${data.content}`,
        postID: data.postID,
        commentID: data.commentID,
        type: NotificationTypeEnum.postCommented
    });
  })


notificationEvent.on('commentReply', async(data:{to:Types.ObjectId, sender:IActor, postID:Types.ObjectId, commentID:Types.ObjectId, content:String})=>{
    await sendNotification({
        userId: data.to,
        senderId: data.sender._id,
        title: "New Reply",
        body: `${fullname(data.sender)} replied to your comment: ${data.content}`,
        postID: data.postID,
        commentID: data.commentID,
        type: NotificationTypeEnum.commentReply
    });
  })


    

    

    
    