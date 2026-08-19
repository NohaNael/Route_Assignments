import Mail from "nodemailer/lib/mailer";
import { createTransport } from "nodemailer";
import { badRequestException } from "../response/error.response";
import { env } from "../../config/config.service";


export const sendEmail= async(data:Mail.Options): Promise<void> => {
    if(!data.html && !data.text && !data.attachments?.length){
        throw new badRequestException("Email content is missing. Provide either HTML, text, or attachments.");
    }

     const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Password,
        },
    }); 

    await transporter.sendMail({...data,from:`${env.Email_User}`,});
}