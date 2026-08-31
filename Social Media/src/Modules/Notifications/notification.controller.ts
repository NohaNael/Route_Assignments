import { Router } from "express";
import {authentication} from "../../Middlewares/authentication.middlewares"
import { validate } from "../../Middlewares/valid.middleware";
import * as validators from "./notification.valid"
import NotificationService from "./notifications.service";



const router= Router()

router.use(authentication())


router.post("/device-token",validate(validators.deviceTokenSchema),NotificationService.deviceToken)
router.delete("/remove-device", validate(validators.deviceTokenSchema),NotificationService.removeDevice)
router.get("/",validate(validators.listnots),NotificationService.listAllNots)
router.get("/unread",NotificationService.unreadCount)
router.patch("/marked-as-read/:notificationId",NotificationService.markedasread)
router.delete("/deletenots",validate(validators.deviceTokenSchema),NotificationService.deletenots)

export default router;