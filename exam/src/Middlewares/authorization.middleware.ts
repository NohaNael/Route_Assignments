import { Request, Response, NextFunction } from "express";
import { Role } from "../types/enums";
import { forbiddenException, unauthorizedException } from "../Utils/response/error.response";

/**
 * Usage: router.post("/", authenticate, authorize(Role.ADMIN), controller)
 * Must run AFTER `authenticate` so req.user is populated.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new unauthorizedException("Authentication is required before authorization");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new forbiddenException("You do not have permission to perform this action");
    }
    next();
  };
}
