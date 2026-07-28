import {Router} from 'express'
import {validation} from '../../Middlewares/valid.middleware.js';
import * as msgRouter from './msg.service.js'
import * as msgValidation from './msg.valid.js'
import { authentication, tokenTypeEnum } from '../../Middlewares/auth.middleware.js';


const router = Router()

router.post('/send/:receiverID', validation(msgValidation.sendMessage),msgRouter.sendMessage )
router.get('/',authentication({tokenType:tokenTypeEnum.ACCESS}), msgRouter.getMessages)
router.patch('/:messageID/read',authentication({tokenType:tokenTypeEnum.ACCESS}),validation(msgValidation.toggleRead), msgRouter.toggleRead)
router.patch('/:messageID/favorite',authentication({tokenType:tokenTypeEnum.ACCESS}),validation(msgValidation.toggleFav), msgRouter.toggleFav)

export default router