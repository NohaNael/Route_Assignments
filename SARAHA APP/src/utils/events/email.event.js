import {EventEmitter} from 'events'
import {sendEmail, emailsubject} from '../email/email.utils.js'

export const emailEventEmitter = new EventEmitter();

emailEventEmitter.on('sendEmail', async ({to, Fname, otp}) => {
    try{
    await sendEmail({
        to,
        subject: emailsubject.confirmEmail,
        html: `<p>Hello ${Fname},</p><p>Your email confirmation OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
    });
    } catch(error){
        console.error('Error sending email:', error);
    }
});

emailEventEmitter.on('forgetpassword', async ({to,cc,text, bcc,html,attachments,subject}) => {
    try{
    await sendEmail({to:to,
        subject:emailsubject.resetPassword});    }

    catch(error){
        console.error('Error sending email:', error);
    }
});