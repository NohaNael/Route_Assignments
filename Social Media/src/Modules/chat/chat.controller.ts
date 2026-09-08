import {Router} from "express"
import {authentication} from "../../Middlewares/authentication.middlewares"
import * as validators from "./chat.valid.js";
import {validate} from "../../Middlewares/valid.middleware.js";
import { ChatService } from "./chat.service.js";

const router=Router()

router.use(authentication())

router.get("/", validate(validators.conversationalSchema), async(req:any,res:any)=>{
    const service = new ChatService()
    return await service.listConversation(req, res)
})

router.get("/unread-count", async(req:any,res:any)=>{
    const service = new ChatService()
    return await service.unreadCount(req, res)
})

router.get("/:userId", validate(validators.getMessageSchema), async(req:any,res:any)=>{
    const service = new ChatService()
    return await service.getMessage(req, res)
})

export default router;
