export const successResponse = ({res, statusCode=200, message="done", data={}}  
) => {
    res.status(statusCode).json({
        message,
        data
    });
};