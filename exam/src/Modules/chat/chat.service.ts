import { ChatRepository } from "../../DB/repositories/chat.repository";
import { CompanyModel } from "../../DB/models/company.model";
import { forbiddenException, notFoundException } from "../../Utils/response/error.response";
import { IUser } from "../../types/interfaces";

async function isHrOrCompanyOwner(userId: string): Promise<boolean> {
  const company = await CompanyModel.findOne({
    $or: [{ createdBy: userId }, { HRs: userId }],
    deletedAt: null,
  });
  return !!company;
}

export const ChatService = {
  async getHistory(currentUserId: string, otherUserId: string) {
    const thread = await ChatRepository.findThreadBetween(currentUserId, otherUserId);
    if (!thread) throw new notFoundException("No conversation found with this user");
    return thread;
  },

  async sendMessage(sender: IUser, receiverId: string, message: string) {
    const existingThread = await ChatRepository.findThreadBetween(sender._id.toString(), receiverId);

    if (!existingThread) {
      // Only an HR or company owner may START a new conversation with a regular user.
      const senderIsHrOrOwner = await isHrOrCompanyOwner(sender._id.toString());
      if (!senderIsHrOrOwner) {
        throw new forbiddenException("Only a company HR or owner can start a new conversation");
      }

      const thread = await ChatRepository.createThread(sender._id.toString(), receiverId, {
        message,
        senderId: sender._id,
        sentAt: new Date(),
      });
      return thread;
    }

    // Thread already exists — either participant (HR/owner or the regular user replying) may send.
    const updated = await ChatRepository.appendMessage((existingThread._id as unknown as string).toString(), {
      message,
      senderId: sender._id,
      sentAt: new Date(),
    });
    return updated;
  },
};
