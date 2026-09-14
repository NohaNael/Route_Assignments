import { Socket, Server as SocketIOServer } from "socket.io";
import { ChatService } from "./chat.service";
import { SOCKET_EVENTS } from "../../Utils/socket/socket.util";
import { IUser } from "../../types/interfaces";

interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

/** Wires the chat-related socket events for a single connected client. */
export function registerChatSocketHandlers(io: SocketIOServer, socket: AuthenticatedSocket): void {
  const user = socket.user!;

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (data: { receiverId: string; message: string }, ack?: (res: { success: boolean; message?: string }) => void) => {
      try {
        const thread = await ChatService.sendMessage(user, data.receiverId, data.message);
        io.to(`user:${data.receiverId}`).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
          senderId: user._id,
          message: data.message,
          threadId: thread?._id,
        });
        if (typeof ack === "function") ack({ success: true });
      } catch (error) {
        if (typeof ack === "function") ack({ success: false, message: (error as Error).message });
      }
    }
  );
}
