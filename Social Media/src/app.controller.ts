import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/config.service';
import { corsOptions } from './Utils/cors/cors';
import rateLimit,{RateLimitRequestHandler} from 'express-rate-limit';
import { globalErrorHandler, notFoundException } from './Utils/response/error.response';
import { authcontroller, notificationController, postcontroller, usercontroller } from './Modules';
import connectDB from './DB/connection';
import { initializeFirebase } from './Utils/firebase/firebase.config';



const limiter:RateLimitRequestHandler=rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
export const bootstrap = async ():Promise<void> => {


    const app:Express =express();

    app.use(helmet(),limiter,cors(corsOptions));
    app.use(cors(corsOptions));
    app.use(express.json());
    initializeFirebase();

    await connectDB();

    app.get('/', (req:Request, res:Response) => {
       return res.status(200).json({message:'Hello Social Media!'});
    });

    app.use('/api/v1/auth',authcontroller);
    app.use('/api/v1/post',postcontroller);
    app.use('/api/v1/user',usercontroller);
    app.use('/api/v1/notifications',notificationController  )

    // const user = new userModel({
    //     username: 'Noha Nael',
    //     email: `${Date.now()}@gmail.com`,
    //     password: 'password123',
    //     phone: '1234567890'
    // }).save({validateBeforeSave: true});

    app.use((req:Request, res:Response, next) => {
        throw new notFoundException('Route not found');
    });
    
    app.use(globalErrorHandler);


    app.listen(env.PORT, () => {
        console.log('Server is running on port 3001');
    });
}

