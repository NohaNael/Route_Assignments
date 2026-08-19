import crypto from 'node:crypto';
import { env } from '../../config/config.service';



const IV_Length = 16; 
const ENC_Security = Buffer.from(env.Encryption_key,'utf-8')

//should be 32 bytes // This is a secret key used for encryption and decryption. In a real application, you should store this securely and not hard-code it.

export const encrypt = (text:string):string => {

    const iv = crypto.randomBytes(IV_Length);   //it makes sure that the same plain text will encrypt to different cipher text each time, enhancing security.
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENC_Security), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};



export const decrypt = (encrypted_data:string):string => {

    const [ivHex, encryptedHex] = encrypted_data.split(':');
    if (!ivHex || !encryptedHex) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENC_Security), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
    
    

   