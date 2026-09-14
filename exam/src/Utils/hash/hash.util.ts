import bcrypt from "bcrypt";
import { env } from "../../config/config.service";

export async function hashValue(plainValue: string): Promise<string> {
  return bcrypt.hash(plainValue, env.SALT_ROUNDS);
}

export async function compareValue(plainValue: string, hashedValue: string): Promise<boolean> {
  return bcrypt.compare(plainValue, hashedValue);
}
