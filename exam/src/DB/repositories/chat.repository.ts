export const ChatRepository: any = {
  async findThreadBetween(userIdA: string, userIdB: string): Promise<any> {
    return null;
  },
  async createThread(userIdA: string, userIdB: string, data: Record<string, unknown>): Promise<any> {
    return { _id: "stub-thread-id", ...data };
  },
  async appendMessage(threadId: string, data: Record<string, unknown>): Promise<any> {
    return { _id: threadId, ...data };
  },
};
