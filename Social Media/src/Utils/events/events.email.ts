import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { template } from '../emails/verify.email.template';
import { sendEmail } from '../emails/send.email';


export const eventEmitter = new EventEmitter();



interface IEmail extends Mail.Options {

        otp: string;
        username: string;
    }
    eventEmitter.on('confirmEmail', async(data: IEmail) => {
        try {
            data.subject='Email Confirmation';
            data.html=template(data.otp,data.username,data.subject);
            await sendEmail(data);
        } catch (error) {
            console.error('Error sending confirmation email:', error);
        }   

    });


