import crypto from "crypto";
import { env } from "../../config/config.service";

const ALGORITHM = "aes-256-cbc";

// Mobile numbers must be reversible (unlike passwords), so we use symmetric
// encryption rather than hashing. Key/IV come from env so they can be rotated
// without touching code.
export function encryptMobileNumber(plainMobile: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex").subarray(0, 32);
  const iv = Buffer.from(env.ENCRYPTION_IV, "hex").subarray(0, 16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainMobile, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptMobileNumber(encryptedMobile: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex").subarray(0, 32);
  const iv = Buffer.from(env.ENCRYPTION_IV, "hex").subarray(0, 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedMobile, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
