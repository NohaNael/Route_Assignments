import {Router} from 'express'
import * as authService from './auth.service.js'
import { tokenTypeEnum } from '../../Middlewares/auth.middleware.js'
import { authentication } from '../../Middlewares/auth.middleware.js';
import * as authvalid from "./auth.valid.js"
import { validation } from '../../Middlewares/valid.middleware.js';
 

const router = Router()
router.post('/signup',validation(authvalid.signUpSchema) ,authService.signUp)
router.post('/login',validation(authvalid.loginSchema), authService.login)
router.post('/logout',authentication({tokenType: tokenTypeEnum.ACCESS}), authService.logout)
router.patch('/confirm-email',validation(authvalid.confirmEmailSchema), authService.confirmEmail)
router.post('/social-login',authentication({tokenType: tokenTypeEnum.ACCESS}), authService.loginwithgoogle)
router.patch('/forget-password',validation(authvalid.forgetPasswordSchema), authService.forgetPassword)

router.patch('/reset-password',validation(authvalid.resetPasswordSchema), authService.resetPassword)


router.post('/refresh-token',authentication({tokenType: tokenTypeEnum.REFRESH}), authService.refreshToken)

router.post('/logout-with-redis',authentication({tokenType: tokenTypeEnum.ACCESS}), authService.logoutWithRedis)

export default router