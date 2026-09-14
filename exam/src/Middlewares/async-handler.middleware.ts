import { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps async controllers so any rejected promise is forwarded to the global
// error handler instead of crashing the process or requiring try/catch everywhere.
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
