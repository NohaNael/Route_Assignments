import { Types } from "mongoose";
import { NotificationModel, NotificationTypeEnum } from "../../DB/models/notification.model";
import { userModel } from "../../DB/models/user.model";
import { getMessaging } from "./firebase.config";





export interface INotificationPayload {

    userId:Types.ObjectId;
    senderId:Types.ObjectId;
    title:string;
    body:string;
    commentID?:Types.ObjectId;
    requestID?:Types.ObjectId;
    postID?:Types.ObjectId;
    type:NotificationTypeEnum;

}

const buildData = (payload:INotificationPayload) :Record<string,string> => {
    const data:Record<string,string>={

        type:payload.type,
        senderId:payload.senderId.toString(),
    }
    if(payload.commentID)data.commentID=payload.commentID.toString();
       if(payload.postID) data.postID=payload.postID?.toString() 
       if(payload.requestID) data.requestID=payload.requestID?.toString()

        return data;
    }

    export const sendNotification = async(payload:INotificationPayload):Promise<void> => {

        try{
            if(payload.userId.equals(payload.senderId)) return;


            const recipient= await userModel.findById(payload.userId).select('deviceToken notificationenabled');

            if(!recipient) return;

            if(!recipient.blockedUsers?.some((id)=>id.equals(payload.senderId))) return;


            await NotificationModel.create({userId:payload.userId, senderId:payload.senderId, title:payload.title, body:payload.body, type:payload.type, ...(payload.postID && {postID:payload.postID}), ...(payload.commentID && {commentID:payload.commentID}), ...(payload.requestID && {requestID:payload.requestID})
        });

        if(recipient.notificationenabled==false){
            console.log('Notification is disabled for this user');

             return;
        }
       const tokens = recipient.deviceToken ? [recipient.deviceToken] : [];

        if(!tokens.length) return;

        const messaging = getMessaging();
        if(!messaging) {
            console.log('Firebase messaging is not initialized');
            return;
        }
        const response = await messaging.sendEachForMulticast({
            tokens,
            notification:{
                title:payload.title,
                body:payload.body
            },
            data:buildData(payload)
        });
        console.log('Notification sent successfully:', response.successCount, 'success,', response.failureCount, 'failure');

        } catch(error){
            console.error('Error sending notification:', error);
        }
    }

    export const sendNotificationToMultipleUsers = async (
  userIds: Types.ObjectId[],
  payload: Omit<INotificationPayload, "userId">
): Promise<void> => {
  await Promise.all(
    userIds.map((userId) => sendNotification({ ...payload, userId }))
  );
};
