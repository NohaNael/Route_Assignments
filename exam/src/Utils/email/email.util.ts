import { mailTransporter } from "./mailer.config";
import { env } from "../../config/config.service";

interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: ISendEmailOptions): Promise<void> {
  await mailTransporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

export function otpEmailTemplate(otp: string, purpose: string): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${purpose}</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code expires in ${env.OTP_EXPIRES_IN_MINUTES} minutes.</p>
    </div>
  `;
}

export function applicationAcceptedTemplate(jobTitle: string): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Congratulations!</h2>
      <p>Your application for <strong>${jobTitle}</strong> has been accepted. The company will reach out to you with next steps.</p>
    </div>
  `;
}

export function applicationRejectedTemplate(jobTitle: string): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Application Update</h2>
      <p>Thank you for applying for <strong>${jobTitle}</strong>. Unfortunately, we will not be moving forward with your application at this time.</p>
    </div>
  `;
}
