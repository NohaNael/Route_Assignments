import {Router} from 'express'
import * as userService from "./user.service.js"
import { successResponse } from "../../utils/success.response.js";
import { notFoundResponse } from "../../utils/err.response.js";
import {tokenTypeEnum} from '../../middlewares/auth.middleware.js'
import { authentication } from '../../Middlewares/auth.middleware.js';
import { signarureEnum } from '../../utils/enums/user.enum.js';
import { authorization } from '../../Middlewares/auth.middleware.js';
import { localfileupload } from '../../utils/multer/local.multer.js';
import {updateProfilePic} from './user.service.js'
import { fileValidator } from '../../utils/multer/local.multer.js';
import { updateCoverPic } from './user.service.js';
import {validation} from '../../Middlewares/valid.middleware.js';
import * as userValid from "./user.valid.js"

const router = Router()

router.get("/profile",
     authentication(), 
     authorization({roles: [signarureEnum.admin,signarureEnum.user]}),
      userService.getUserProfile);



router.put("/upload-file",
     authentication(), 
    authorization({roles: [signarureEnum.admin,signarureEnum.user]}),
     localfileupload({customPath: "users", validation: [...fileValidator.images] }).single("file"),
      userService.updateProfilePic);


router.patch("/upload-cover-img",
     authentication(), 
    authorization({roles: [signarureEnum.admin,signarureEnum.user]}),
     localfileupload({customPath: "users", validation: [...fileValidator.images] }).array("file",3),
      userService.updateCoverPic);

router.patch("/update-password",
     authentication(), 
    authorization({roles: [signarureEnum.admin,signarureEnum.user]}),
    validation(userValid.updatePasswordSchema),
     userService.updatePassword)
   

router.patch("/freeze-account",
     authentication(), 
    authorization({roles: [signarureEnum.admin, signarureEnum.user]}),
     userService.freezeAccount);

router.patch("/freeze-account/:userID",
     authentication(), 
    authorization({roles: [signarureEnum.admin, signarureEnum.user]}),
    validation(userValid.freezeSchema),
     userService.freezeAccount);   



router.patch("{/:userID}/restore-account",
     authentication(), 
    authorization({roles: [signarureEnum.admin, signarureEnum.user]}),
    validation(userValid.freezeSchema),
     userService.restoreAccount);   

router.patch("{/:userID}/hard-delete",
     authentication(), 
    authorization({roles: [signarureEnum.admin]}),
    validation(userValid.freezeSchema),
     userService.hardDeleteAccount);


export default router