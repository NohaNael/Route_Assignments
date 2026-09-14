import crypto from "crypto";
import { env } from "../../config/config.service";
import { CONSTANTS } from "../../config/constants";
import { hashValue } from "../hash/hash.util";
import { OtpType } from "../../types/enums";
import { IOtp } from "../../types/interfaces";

/** Generates a numeric OTP code of configured length, e.g. "483920". */
export function generatePlainOtp(): string {
  const min = Math.pow(10, CONSTANTS.OTP_LENGTH - 1);
  const max = Math.pow(10, CONSTANTS.OTP_LENGTH) - 1;
  return crypto.randomInt(min, max).toString();
}

/** Builds a ready-to-store OTP subdocument (hashed code + expiry) and returns the plain code to email the user. */
export async function buildOtpEntry(type: OtpType): Promise<{ plainCode: string; entry: IOtp }> {
  const plainCode = generatePlainOtp();
  const hashedCode = await hashValue(plainCode);
  const expiresIn = new Date(Date.now() + env.OTP_EXPIRES_IN_MINUTES * 60 * 1000);

  return {
    plainCode,
    entry: { code: hashedCode, type, expiresIn },
  };
}
