import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../Utils/token/token.util";
import { UserRepository } from "../DB/repositories/user.repository";
import { unauthorizedException } from "../Utils/response/error.response";
import { asyncHandler } from "./async-handler.middleware";

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    throw new unauthorizedException("Access token is required");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new unauthorizedException("Access token is required");
  }

  const payload = verifyAccessToken(token);

  const user = await UserRepository.findById(payload.id);
  if (!user || user.deletedAt) {
    throw new unauthorizedException("User no longer exists");
  }
  if (user.bannedAt) {
    throw new unauthorizedException("This account has been banned");
  }

  req.user = user;
  next();
});
