import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { AppError } from "../Utils/response/error.response";

type ClassConstructor<T> = new (...args: unknown[]) => T;

function flattenErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...flattenErrors(error.children));
    }
  }
  return messages;
}

/**
 * Validates req.body (default) or req.query/req.params against a class-validator DTO.
 * Usage: router.post("/", validateDto(SignupDto), controller)
 */
export function validateDto<T extends object>(
  dtoClass: ClassConstructor<T>,
  source: "body" | "query" | "params" = "body"
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req[source]);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      const messages = flattenErrors(errors);
      return next(new AppError(messages.join(", "), 422));
    }

    req[source] = instance as unknown as typeof req[typeof source];
    next();
  };
}
