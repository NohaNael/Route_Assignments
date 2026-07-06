import {Router} from 'express'
import * as authService from './auth.service.js'
import { tokenTypeEnum } from '../../middlewares/auth.middleware.js'
import { authentication } from '../../Middlewares/auth.middleware.js';
import * as authvalid from "./auth.valid.js"
import { validation } from '../../Middlewares/valid.middleware.js';

const router = Router()
router.post('/signup',validation(authvalid.signUpSchema) ,authService.signUp)
router.post('/login',validation(authvalid.loginSchema), authService.login)
router.post('/social-login',authentication({tokenType: tokenTypeEnum.ACCESS}), authService.loginwithgoogle)
router.post('/refresh-token',authentication({tokenType: tokenTypeEnum.REFRESH}), authService.refreshToken)


export default router