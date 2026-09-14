import { Router, Request, Response } from "express";
import { ChatService } from "./chat.service";
import { successResponse } from "../../Utils/response/success.response";
import { asyncHandler } from "../../Middlewares/async-handler.middleware";
import { authenticate } from "../../Middlewares/auth.middleware";

const chatcontroller = Router();

chatcontroller.use(authenticate);

chatcontroller.get(
  "/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const thread = await ChatService.getHistory(req.user!._id.toString(), userId ?? "");
    successResponse(res, 200, "Chat history retrieved successfully", thread);
  })
);

export default chatcontroller;
