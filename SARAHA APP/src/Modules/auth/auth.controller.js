import {Router} from 'express'
import * as authService from './auth.service.js'

const router = Router()
router.get('/getuser',authService.getuser)

export default router