import { Server, Socket } from "socket.io";
import http from "http";
import socketAuthMiddleware from "./middlewares/socketIoAuth-middlware";
import Message from "./models/Message";
import Chat from "./models/Chat";
import { Types } from "mongoose";

// Типы для событий
interface JoinRoomPayload {
  currentUserId: string;
  toUserId: string;
}

interface SendMessagePayload {
  senderUserId: string;
  recipientUserId: string;
  message: string;
  user: { first_name: string; second_name: string; img_url: string };
}

// Функция для создания уникального идентификатора комнаты
const getRoomId = (userId1: string, userId2: string): string => {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
};

// Функция для создания и настройки Socket.io сервера
export const createSocketServer = (server: http.Server): void => {
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: process.env.CLIENT_URL || "",
    },
  });

  // Middleware для аутентификации WebSocket соединений
  io.use(socketAuthMiddleware);

  // Логика Socket.io
  io.on("connection", (socket: Socket & { user?: { _id: string } }) => {
    console.log(`User connected: ${socket?.id}`);

    if (socket.user?._id) {
      socket.join(socket.user._id);
    }

    socket.on("joinRoom", ({ currentUserId, toUserId }) => {
      if (currentUserId && toUserId) {
        const roomId = getRoomId(currentUserId, toUserId);
        socket.join(roomId); // Подключаем пользователя к комнате
      }
    });

    socket.on("typing", ({ currentUserId, toUserId }) => {
      const roomId = getRoomId(currentUserId, toUserId);
      socket.to(roomId).emit("userTyping", { currentUserId });
    });

    socket.on("stopTyping", ({ currentUserId, toUserId }) => {
      const roomId = getRoomId(currentUserId, toUserId);
      socket.to(roomId).emit("userStopTyping", { currentUserId });
    });

    socket.on("markAsRead", async ({ currentUserId, toUserId }) => {
      try {
        const roomId = getRoomId(currentUserId, toUserId);
        const chat = await Chat.findById(roomId);

        if (chat) {
          // Получаем текущее количество непрочитанных сообщений
          const prevUnread = chat.unreadMessages.get(currentUserId) || 0;

          // Сбрасываем непрочитанные
          chat.unreadMessages.set(currentUserId, 0);
          await chat.save();

          // Вычисляем разницу
          const diff = -prevUnread;

          // Отправляем уведомление только конкретному пользователю, которому нужно обновить счетчик
          io.to(currentUserId).emit("newMessageNotification", { diff });

          // Если нужно, обновляем сайдбар для всех
          io.emit("updateSidebar", {
            roomId,
            unreadMessages: Object.fromEntries(chat.unreadMessages),
          });
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("sendMessage", async (payload: SendMessagePayload) => {
      const { senderUserId, recipientUserId, message, user } = payload;
      const roomId = getRoomId(senderUserId, recipientUserId);

      try {
        let chat = await Chat.findOne({
          _id: roomId,
          participants: { $all: [senderUserId, recipientUserId] },
        });

        if (!chat) {
          chat = new Chat({
            _id: roomId,
            participants: [senderUserId, recipientUserId],
            is_active: true,
            unreadMessages: new Map(
              recipientUserId ? [[recipientUserId, 1]] : []
            ),
          });
          await chat.save();
        } else {
          // Проверяем, подключен ли получатель к комнате
          const room = io.sockets.adapter.rooms.get(roomId);
          const isRecipientConnected = room && room.size > 1;

          if (!isRecipientConnected) {
            if (recipientUserId) {
              const unreadCount = chat.unreadMessages.get(recipientUserId) || 0;
              chat.unreadMessages.set(recipientUserId, unreadCount + 1);
            }
          }
        }

        // Создаем сообщение
        const newMessage = new Message({
          sender: senderUserId,
          recipient: recipientUserId,
          text: message,
          timestamp: new Date(),
          status: "sent",
        });

        await newMessage.save();

        // Обновляем чат
        chat.messages.push(newMessage._id);
        chat.lastMessage = newMessage._id as Types.ObjectId;
        await chat.save();

        // Отправляем событие в комнату
        io.in(roomId).emit("receiveMessage", newMessage);
        io.to(recipientUserId).emit("newMessageNotification", {
          newMessage,
          user,
        });

        // Обновляем сайдбар для всех пользователей
        io.emit("updateSidebar", {
          roomId,
          lastMessage: newMessage,
          unreadMessages: Object.fromEntries(chat.unreadMessages),
        });

        console.log("Message sent and chat updated");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
