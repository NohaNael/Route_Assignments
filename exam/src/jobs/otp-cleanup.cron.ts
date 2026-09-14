import cron from "node-cron";
import { UserModel } from "../DB/models/user.model";
import { CONSTANTS } from "../config/constants";

export function scheduleOtpCleanupJob(): void {
  cron.schedule(CONSTANTS.CRON_OTP_CLEANUP_SCHEDULE, async () => {
    try {
      const result = await UserModel.updateMany(
        {},
        { $pull: { OTP: { expiresIn: { $lt: new Date() } } } }
      );
      // eslint-disable-next-line no-console
      console.log(`🧹 OTP cleanup job ran — matched ${result.matchedCount} user(s)`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("OTP cleanup job failed:", error);
    }
  });
}
