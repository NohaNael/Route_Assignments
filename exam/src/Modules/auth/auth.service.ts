import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../DB/repositories/user.repository";
import { Provider, Role, OtpType } from "../../types/enums";
import { AppError, conflictException, unauthorizedException } from "../../Utils/response/error.response";
import { buildOtpEntry } from "../../Utils/otp/otp.util";
import { sendEmail, otpEmailTemplate } from "../../Utils/email/email.util";
import { compareValue, hashValue } from "../../Utils/hash/hash.util";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../Utils/token/token.util";
import { env } from "../../config/config.service";
import { SignupDto } from "./dto/signup.dto";
import { SigninDto } from "./dto/signin.dto";
import { ConfirmOtpDto } from "./dto/confirm-otp.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { GoogleAuthDto } from "./dto/google-auth.dto";
import { IUser } from "../../types/interfaces";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function issueTokenPair(user: IUser) {
  const payload = { id: user._id.toString(), role: user.role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export const AuthService = {
  async signup(dto: SignupDto) {
    const existingUser = await UserRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new conflictException("Email already exists");
    }

    const { plainCode, entry } = await buildOtpEntry(OtpType.CONFIRM_EMAIL);

    // Password hashing + mobile encryption happen in the User model's pre-save hook.
    const user = await UserRepository.create({
      ...dto,
      DOB: new Date(dto.DOB),
      provider: Provider.SYSTEM,
      role: Role.USER,
      OTP: [entry],
    });

    await sendEmail({
      to: user.email,
      subject: "Confirm your email",
      html: otpEmailTemplate(plainCode, "Confirm Your Email"),
    });

    return { id: user._id, email: user.email };
  },

  async confirmOtp(dto: ConfirmOtpDto) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) throw new AppError("User not found", 404);

    const confirmEntries = user.OTP.filter((o: { type: OtpType }) => o.type === OtpType.CONFIRM_EMAIL);
    if (confirmEntries.length === 0) {
      throw new AppError("No pending confirmation OTP for this account", 400);
    }

    // Check the most recent OTP of this type
    const latest = confirmEntries[confirmEntries.length - 1];
    if (latest.expiresIn < new Date()) {
      throw new AppError("OTP has expired", 400);
    }

    const isMatch = await compareValue(dto.otp, latest.code);
    if (!isMatch) {
      throw new AppError("Invalid OTP", 400);
    }

    user.isConfirmed = true;
    user.OTP = user.OTP.filter((o: { type: OtpType }) => o.type !== OtpType.CONFIRM_EMAIL);
    await user.save();

    return { confirmed: true };
  },

  async signin(dto: SigninDto) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user || user.provider !== Provider.SYSTEM) {
      throw new unauthorizedException("Invalid credentials");
    }
    if (!user.isConfirmed) {
      throw new unauthorizedException("Please confirm your email before signing in");
    }
    if (user.bannedAt) {
      throw new unauthorizedException("This account has been banned");
    }
    if (user.deletedAt) {
      throw new unauthorizedException("This account no longer exists");
    }

    const isMatch = await compareValue(dto.password, user.password as string);
    if (!isMatch) {
      throw new unauthorizedException("Invalid credentials");
    }

    return { user, tokens: issueTokenPair(user) };
  },

  async googleAuth(dto: GoogleAuthDto) {
    const ticket = await googleClient.verifyIdToken({
      idToken: dto.idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new unauthorizedException("Invalid Google token");
    }

    let user = await UserRepository.findByEmail(payload.email);

    if (!user) {
      // First-time Google signup: mobileNumber/DOB/gender are placeholders the user can
      // complete later via the "update account" endpoint.
      user = await UserRepository.create({
        firstName: payload.given_name || "Google",
        lastName: payload.family_name || "User",
        email: payload.email,
        provider: Provider.GOOGLE,
        role: Role.USER,
        isConfirmed: true,
        gender: undefined,
        DOB: undefined,
        mobileNumber: undefined,
        OTP: [],
      } as unknown as Partial<IUser>);
    } else if (user.provider !== Provider.GOOGLE) {
      throw new conflictException("This email is already registered with a different sign-in method");
    }

    if (user.bannedAt) throw new unauthorizedException("This account has been banned");

    return { user, tokens: issueTokenPair(user) };
  },

  async sendForgetPasswordOtp(dto: ForgetPasswordDto) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) throw new AppError("User not found", 404);

    const { plainCode, entry } = await buildOtpEntry(OtpType.FORGET_PASSWORD);
    user.OTP.push(entry);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: otpEmailTemplate(plainCode, "Reset Your Password"),
    });

    return { sent: true };
  },

  async resetPassword(dto: ResetPasswordDto) {
    const user = await UserRepository.findByEmail(dto.email);
    if (!user) throw new AppError("User not found", 404);

    const forgetEntries = user.OTP.filter((o: { type: OtpType }) => o.type === OtpType.FORGET_PASSWORD);
    if (forgetEntries.length === 0) {
      throw new AppError("No pending password reset OTP for this account", 400);
    }

    const latest = forgetEntries[forgetEntries.length - 1];
    if (latest.expiresIn < new Date()) {
      throw new AppError("OTP has expired", 400);
    }

    const isMatch = await compareValue(dto.otp, latest.code);
    if (!isMatch) {
      throw new AppError("Invalid OTP", 400);
    }

    user.password = await hashValue(dto.newPassword);
    user.OTP = user.OTP.filter((o: { type: OtpType }) => o.type !== OtpType.FORGET_PASSWORD);
    user.changeCredentialTime = new Date();
    await user.save();

    return { reset: true };
  },

  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserRepository.findById(payload.id);
    if (!user) throw new unauthorizedException("User no longer exists");

    // Invalidate old tokens issued before a password change / credential reset.
    if (user.changeCredentialTime) {
      const tokenIssuedAt = payload.iat * 1000;
      if (tokenIssuedAt < user.changeCredentialTime.getTime()) {
        throw new unauthorizedException("Token is no longer valid, please sign in again");
      }
    }

    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
    return { accessToken };
  },
};
