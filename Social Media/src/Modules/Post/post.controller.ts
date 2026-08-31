import {validate} from "../../Middlewares/valid.middleware"
import {Router} from "express"
import * as validators from "./post.validation"
import { authentication } from "../../Middlewares/authentication.middlewares"
import { filevalidation, localfileupload } from "../../Utils/multer/local.mulrt"
import postservice from "./post.service"


const router = Router()

router.use(authentication())

router.post("/",localfileupload({validation:filevalidation.image,folder:"post",maxSize:5}).array("attachments",5),validate(validators.createPostSchema), postservice.createPost)


router.patch("/:postID/like",validate(validators.postIdParamsSchema), postservice.toggleLikePost)
router.patch("/:postID/update",validate(validators.postIdParamsSchema), postservice.updatePost)
router.delete("/:postID/delete",validate(validators.postIdParamsSchema), postservice.deletePost)

router.post("/:postID/comment",validate(validators.CreateCommentSchema), postservice.addComment)
router.patch("/comment/:commentID",validate(validators.updateCommentSchema), postservice.updateComment)


router.delete("/comment/:commentID",validate(validators.CommentIdParamSchema), postservice.deleteComment)
export default router
