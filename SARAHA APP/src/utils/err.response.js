export const errorResponse = ({res, statusCode=400, message="error", extra=undefined}  
) => {
    const error = new Error(typeof message === "string" ? message : message?.message);

    error.statusCode = statusCode;
    error.extra = extra;
    throw error;
};

export const badRequestResponse = ( message="bad request", extra=undefined) => {
    return errorResponse({res, statusCode:400, message, extra})
};

export const unauthorizedResponse = ( message="unauthorized", extra=undefined) => {
    return errorResponse({res, statusCode:401, message, extra})
}

export const conflictResponse = ( message="conflict", extra=undefined) => {
    return errorResponse({ statusCode:409, message, extra})
}


export const notFoundResponse = ( message="not found", extra=undefined) => {
    return errorResponse({ statusCode:404, message, extra})
}

export const forbiddenResponse = ( message="forbidden", extra=undefined) => {
    return errorResponse({ statusCode:403, message, extra})
}


export const globalErrorHandler=(err,req,res,next)=>{

    const statusCode=err.statusCode ?? 500;
    return res.status(statusCode).json({
        message:err.message , stack:err.stack,
        extra:err.extra,
        status: statusCode
    })
};
