import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { CONSTANTS } from "../../config/constants";

export const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
  limit: CONSTANTS.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (signup/signin/otp) to slow down brute-force attempts.
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
  limit: CONSTANTS.AUTH_RATE_LIMIT_MAX_REQUESTS,
  message: "Too many auth attempts, please try again later",
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
