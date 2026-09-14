import { Router, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { successResponse } from "../../Utils/response/success.response";
import { asyncHandler } from "../../Middlewares/async-handler.middleware";
import { validateDto } from "../../Middlewares/validation.middleware";
import { authLimiter } from "../../Utils/rate-limit/rate-limit";
import { SignupDto } from "./dto/signup.dto";
import { ConfirmOtpDto } from "./dto/confirm-otp.dto";
import { SigninDto } from "./dto/signin.dto";
import { GoogleAuthDto } from "./dto/google-auth.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

const authcontroller = Router();

authcontroller.use(authLimiter);

authcontroller.post(
  "/signup",
  validateDto(SignupDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.signup(req.body);
    successResponse(res, 201, "Signup successful. Please check your email for the confirmation OTP", result);
  })
);

authcontroller.post(
  "/confirm-otp",
  validateDto(ConfirmOtpDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.confirmOtp(req.body);
    successResponse(res, 200, "Email confirmed successfully", result);
  })
);

authcontroller.post(
  "/signin",
  validateDto(SigninDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.signin(req.body);
    successResponse(res, 200, "Signed in successfully", {
      user: { id: user._id, email: user.email, role: user.role },
      ...tokens,
    });
  })
);

authcontroller.post(
  "/google",
  validateDto(GoogleAuthDto),
  asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.googleAuth(req.body);
    successResponse(res, 200, "Authenticated with Google successfully", {
      user: { id: user._id, email: user.email, role: user.role },
      ...tokens,
    });
  })
);

authcontroller.post(
  "/forget-password",
  validateDto(ForgetPasswordDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.sendForgetPasswordOtp(req.body);
    successResponse(res, 200, "Password reset OTP sent to your email", result);
  })
);

authcontroller.post(
  "/reset-password",
  validateDto(ResetPasswordDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    successResponse(res, 200, "Password reset successfully", result);
  })
);

authcontroller.post(
  "/refresh-token",
  validateDto(RefreshTokenDto),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.refreshToken(req.body.refreshToken);
    successResponse(res, 200, "Access token refreshed", result);
  })
);

export default authcontroller;
