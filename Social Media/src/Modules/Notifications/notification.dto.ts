import {z} from "zod"
import { deviceTokenSchema, listnots, notificationParamsSchema } from "./notification.valid"

export type IDeviceTokenDTO= z.infer<typeof deviceTokenSchema.body>
export type IListAllNots= z.infer<typeof listnots.query>
export type INotificationParamsDTO=z.infer<typeof notificationParamsSchema.params>