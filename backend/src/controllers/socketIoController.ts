import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { Types } from "mongoose";
import ApiError from "../exceptions/api-errors";

class SocketIoController {
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

  // Получить все сообщения между пользователями
  async getMessagesBetweenUsers(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;

      // Найти все сообщения чата
      const messages = await Message.find({ chat: chatId }).sort({
        timestamp: 1,
      });

      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: "Failed to load messages" });
    }
  }

  // Получить все чаты текущего пользователя
  async getAllChats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user; // Получить ID текущего пользователя из токена или сессии

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
}

export default new SocketIoController();
