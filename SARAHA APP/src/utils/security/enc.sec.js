import crypto from 'node:crypto';
import { ENCRYPTION_KEY } from '../../../config/config.service.js';


const IV_Length = 16; 
const ENC_Security = Buffer.from(ENCRYPTION_KEY); //should be 32 bytes // This is a secret key used for encryption and decryption. In a real application, you should store this securely and not hard-code it.

export const encrypt = (plainText) => {

    const iv = crypto.randomBytes(IV_Length);   //it makes sure that the same plain text will encrypt to different cipher text each time, enhancing security.
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENC_Security), iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};



export const decrypt = (cipherText) => {

    const [ivHex, encryptedHex] = cipherText.split(':');
    const binaryiv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENC_Security), binaryiv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};