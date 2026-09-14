import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function setIO(instance: SocketIOServer): void {
  io = instance;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO has not been initialized yet");
  }
  return io;
}

// Central place for socket event names so they're never hardcoded as string literals
// scattered across the codebase.
export const SOCKET_EVENTS = {
  NEW_APPLICATION: "job:newApplication",
  SEND_MESSAGE: "chat:sendMessage",
  RECEIVE_MESSAGE: "chat:receiveMessage",
  DISCONNECT: "disconnect",
};
