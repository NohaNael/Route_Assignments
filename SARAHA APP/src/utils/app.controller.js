import {authRouter,userRouter,msgRouter} from '../Modules/index.js'
import { successResponse } from './success.response.js';
import { notFoundResponse, globalErrorHandler } from './err.response.js';
import connectDB from '../DB/connection.js';
import corsMiddleware from 'cors'
import path from "node:path";
import{sendEmail} from './email/email.utils.js'
import { cors as corsConfig } from './cors/cors.util.js'
import helmet from 'helmet'
import morgan from 'morgan'
import { attachRouterwithLogger } from './loggers/morgan.logger.js'
import { customRateLimiter } from '../Middlewares/rate-limiter.middleware.js';
import { isIPv6 } from 'node:net';
import { connectRedis } from '../DB/redis-connection.js';

// const limiter = rateLimite({
// windowMs: 2 * 60 * 1000, // 15 minutes
// limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
// legacyHeaders: false, 
// isIPv6Subnet:56,
// handler:(req,res)=>{
//     res.status(429).json({
//         status: "fail",
//         message: "Too many requests, please try again later."
//     })
// }// Disable the `X-RateLimit-*` headers
// })  

const bootstrap=async(app,express)=>{
    app.use(express.json(),corsMiddleware(corsConfig()),morgan("common"),helmet(),customRateLimiter());
    await connectDB();
    await connectRedis();

    attachRouterwithLogger(app,'/api/v1/auth',authRouter,'access.log')
    attachRouterwithLogger(app,'/api/v1/user',userRouter,'access.log')
    attachRouterwithLogger(app,'/api/v1/messages',msgRouter,'access.log')
    
 
    app.use("/uploads",express.static(path.resolve("./src/uploads")))
    app.all('/*splat',(req,res)=>{
        throw notFoundResponse('route not found')
    });
    app.use(globalErrorHandler)
}


export default bootstrap