import { NextFunction, Request, Response } from "express";
import { env } from "../../config/config.service";


export interface IError extends Error {
    statusCode?: number;

}
export class ApplicationException extends Error  {

    constructor(message: string, public statusCode: number = 400, options?: ErrorOptions) {
        super(message, options);
        this.name = this.constructor.name;
    }
}

export class badRequestException extends ApplicationException {
    constructor(message: string, statusCode: number = 400,options?: ErrorOptions) {
        super(message, statusCode,options);
    }   }


export class notFoundException extends ApplicationException {
    constructor(message: string, statusCode: number = 404,options?: ErrorOptions) {
        super(message, statusCode,options);
    }   
}


export class UnauthorizedException extends ApplicationException {
    constructor(message: string, statusCode: number = 401,options?: ErrorOptions) {
        super(message, statusCode,options);
    }}


export class conflictException extends ApplicationException {
    constructor(message: string, statusCode: number = 409,options?: ErrorOptions) {
        super(message, statusCode,options);
    }   }


export class tooManyRequestsException extends ApplicationException {
    constructor(message: string, statusCode: number = 429,options?: ErrorOptions) {
        super(message, statusCode,options);
    }}


export class forbidden extends ApplicationException {
    constructor(message: string, statusCode: number = 403,options?: ErrorOptions) {
        super(message, statusCode,options);
    }}


export const globalErrorHandler = (err: IError, req: Request, res: Response, next: NextFunction):void => {

    const statusCode = err.statusCode || 500;
    const isDevelopment = env.MODE=== 'development';

    if (statusCode >= 500) {
        console.error(err);
    }
     res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
    });


}