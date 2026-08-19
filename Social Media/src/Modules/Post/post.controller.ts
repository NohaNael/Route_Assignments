import {validate} from "../../Middlewares/valid.middleware"
import {Router} from "express"
import * as validators from "./post.validation"
import { authentication } from "../../Middlewares/authentication.middlewares"
import { filevalidation, localfileupload } from "../../Utils/multer/local.mulrt"
import postservice from "./post.service"

const router = Router()

router.use(authentication())

router.post("/",localfileupload({validation:filevalidation.image,folder:"post",maxSize:5}).array("attachments",5),validate(validators.createPostSchema), postservice.createPost)

export default router
