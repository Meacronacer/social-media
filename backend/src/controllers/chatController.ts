import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { ObjectId, Types } from "mongoose";
import ApiError from "../exceptions/api-errors";
import chatService from "../services/chat.service";
import { IUser } from "../models/User";

class ChatController {
  // Отправка сообщения
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { sender, recipient, text } = req.body;

      // Сохранить сообщение
      const newMessage = await Message.create({ sender, recipient, text });

      // Обновить или создать чат
      let chat = await Chat.findOne({
        participants: { $all: [sender, recipient] },
      });

      if (!chat) {
        chat = await Chat.create({
          participants: [sender, recipient],
          messages: [newMessage.id],
        });
      } else {
        chat.messages.push(newMessage.id);
        chat.lastMessage = newMessage.id;
        await chat.save();
      }

      // Уведомить участника через WebSocket
      const io = req.app.get("io");
      if (io) {
        io.to(recipient).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }

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

  // Получить все чаты текущего пользователя
  async getAllChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as IUser)?._id; // Получить ID текущего пользователя из токена или сессии

      if (!userId) {
        throw ApiError.UnauthorizedError();
      }

      const chats = await Chat.find({ participants: userId })
        .populate("lastMessage") // Подгрузить последнее сообщение
        .populate("participants", "username email"); // Подгрузить информацию о пользователях

      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: "Failed to load chats" });
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
