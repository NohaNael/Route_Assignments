import admin from "firebase-admin";
import {existsSync, readFileSync} from "fs";
import {resolve} from "path";
import {env} from "../../config/config.service";


let messaging: any | null;

export const initializeFirebase = ():void => {

    const keyPath = resolve(env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (!existsSync(keyPath)) {
        throw new Error(`Firebase service account key file not found at path: ${keyPath}`);

    }

    try {
        const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8")) as admin.ServiceAccount;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        messaging = admin.messaging();
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
        throw new Error("Failed to initialize Firebase Admin SDK");
    }
}

export const getMessaging = (): admin.messaging.Messaging | null => messaging;
export {admin};
   

