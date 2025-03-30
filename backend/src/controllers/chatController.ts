import { Request, Response } from "express";
import ApiError from "../exceptions/api-errors";
import chatService from "../services/chat.service";
import { IUser } from "../models/User";

class ChatController {
  async getActiveChats(req: Request, res: Response) {
    const userId = (req?.user as IUser)?._id;
    const { search } = req.query;

    try {
      const activeChats = await chatService.getActiveChats(
        String(userId),
        String(search || "")
      );
      res.status(200).json(activeChats);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch active chats" });
    }
  }

  // Получить все сообщения между пользователями
  async getMessagesBetweenTwoUsers(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const lastMessageId = req.query.lastMessageId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;

      const messages = await chatService.getChatMessages(
        chatId,
        lastMessageId,
        limit
      );

      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: "Failed to load messages" });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as IUser)?._id;
      const count = await chatService.getTotalUnreadMessages(String(userId));
      res.status(200).json({ totalUnread: count });
    } catch (e) {
      res.status(400).json({ message: "Error getting unread count" });
    }
  }
}

export default new ChatController();
