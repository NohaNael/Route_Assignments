import nodemailer from 'nodemailer';
import { UserEmail, UserPassword } from '../../../config/config.service.js';



export async function sendEmail({to,cc,text, bcc,html,attachments,subject}) {
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: UserEmail,
                pass: UserPassword
            }
        });
    try {

        const info = await transporter.sendMail({
            from: `"Route" <${UserEmail}>`,
            to,
            cc,
            text,
            bcc,
            html,
            attachments,
            subject
        });

    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const emailsubject={
    confirmEmail:"Confirm your email",
    resetPassword:"Reset your password",
    welcome:"Welcome to Our Service",
    contactUs:"Contact Us",
}