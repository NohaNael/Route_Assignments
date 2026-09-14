import { Request, Response, NextFunction } from "express";
import { env } from "../../config/config.service";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class notFoundException extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class unauthorizedException extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class forbiddenException extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class conflictException extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

// Registered LAST in app.controller.ts, after every route, so it must take 4 params
// for Express to treat it as an error-handling middleware.
export function globalErrorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as unknown as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate value: this field must be unique",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
}
