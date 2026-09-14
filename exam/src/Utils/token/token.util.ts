import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/config.service";
import { Role } from "../../types/enums";

export interface ITokenPayload {
  id: string;
  role: Role;
}

export function generateAccessToken(payload: ITokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
}

export function generateRefreshToken(payload: ITokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

export function verifyAccessToken(token: string): ITokenPayload & { iat: number; exp: number } {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as ITokenPayload & { iat: number; exp: number };
}

export function verifyRefreshToken(token: string): ITokenPayload & { iat: number; exp: number } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload & { iat: number; exp: number };
}
