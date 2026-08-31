import { Request, Response } from "express";
import { IDeviceTokenDTO, IListAllNots, INotificationParamsDTO } from "./notification.dto";
import { userModel } from "../../DB/models/user.model";
import { NotificationModel } from "../../DB/models/notification.model";
import { notFoundException } from "../../Utils/response/error.response";

class NotificationService {


  deviceToken = async (req: Request, res: Response) => {
    const { token }: IDeviceTokenDTO = req.body;

    await userModel.updateOne(
      { _id: req.user!._id },
      { $addToSet: { deviceToken: token } }
    );

    return res.status(200).json({ message: "device registered successfully" });
  };

  removeDevice = async (req: Request, res: Response) => {
    const { token }: IDeviceTokenDTO = req.body;

    await userModel.updateOne(
      { _id: req.user!._id },
      { $pull: { deviceToken: token } }
    );

    return res.status(200).json({ message: "device removed successfully" });
  };

  listAllNots = async (req: Request, res: Response) => {
    const { page, limit, unreadonly } = req.query as unknown as IListAllNots;
    const skip = (page - 1) * limit;
    const filter = {
      userId: req.user!._id,
      ...(unreadonly === "true" && { readat: null }),
    };

    const [notifications, total, unread] = await Promise.all([
      NotificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      NotificationModel.countDocuments(filter),
      NotificationModel.countDocuments({
        userId: req.user!._id,
        readat: null,
      }),
    ]);

    return res.status(200).json({
      message: "notifications retrieved successfully",
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        unread,
      },
    });
  };

  unreadCount=async (req: Request, res: Response) => {

    const unread=NotificationModel.countDocuments({
        userId:req.user!._id,
        readAt:{$exists:false}
    })

    return res.status(200).json({
        message:"done",
        data:{unread},
    })
}

markedasread=async (req: Request, res: Response) => {
    const {notificationId}:INotificationParamsDTO= req.params as {notificationId:string}

    const notification=await NotificationModel.findOneAndUpdate({
      _id:notificationId,
      userId:req.user!._id,
    },
    {readat:new Date()},
    {new:true})

    if(!notification) throw new notFoundException("NOTIFICATION NOT FOUND")

     return res.status(200).json({
        message:"read",
        data:{notification},
    })
}



deletenots=async (req: Request, res: Response) => {
    const {notificationId}:INotificationParamsDTO= req.params as {notificationId:string}

     const deleted=await NotificationModel.findOneAndDelete({
      _id:notificationId,
      userId:req.user!._id,
    })
    if(!deleted) throw new notFoundException("NOTIFICATION NOT FOUND")

      return res.status(200).json({
        message:"deleted",
     
    })

}
}
export default new NotificationService();