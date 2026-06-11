import {authRouter,userRouter,msgRouter} from '../Modules/index.js'
import { successResponse } from './success.response.js';
import { notFoundResponse, globalErrorHandler } from './err.response.js';
import connectDB from '../DB/connection.js';
const bootstrap=async(app,express)=>{
    app.use(express.json())
    await connectDB();
    
    app.get('/',(req,res)=>{
        return successResponse({res,message:"welcome to saraha app"})

    })
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/user',userRouter)
    app.use('/api/v1/messages',msgRouter)
    app.all('/*splat',(req,res)=>{
        throw notFoundResponse('route not found')
    });
    app.use(globalErrorHandler)
}


export default bootstrap