import { Server as SocketIOServer, type Socket as SocketIO } from "socket.io";
import type { Server as HttpServer } from "http";
import type { HUserDoc } from "../../DB/models/user.model";
import { decodedtoken } from "../sec/token";
import { registerPresenceEvents } from "./presence";
import { registerChatEvents } from "./chat.socket";

export interface AuthSocket extends SocketIO {
    user?: HUserDoc;
}

let io: SocketIOServer | null = null;

export const getIo = (): SocketIOServer | null => io;

export const initializeSocket = (httpServer: HttpServer): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.use(async (socket: AuthSocket, next) => {
        try {
            const authorization = socket.handshake.auth?.token as string | undefined;
            const { user } = await decodedtoken({ authorization });
            socket.user = user;

            next();
        } catch (error) {
            next(new Error((error as Error).message || "unauthorized socket"));
        }
    });

    io.on("connection", (socket: AuthSocket) => {
        const user = socket.user;
        const userID = user?._id.toString() as string;

        console.log(`socket connected:${user?.firstname ?? "unknown"}(${socket.id})`);

        socket.join(userID);
        registerPresenceEvents(io!,socket)
        registerChatEvents(io!,socket)
        

    });

    console.log("Socket.IO server is ready");
    return io;
};
