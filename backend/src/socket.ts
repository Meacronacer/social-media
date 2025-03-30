import { Server, Socket } from "socket.io";
import http from "http";
import socketAuthMiddleware from "./middlewares/socketIoAuth-middlware";
import Message from "./models/Message";
import Chat from "./models/Chat";
import logger from "./config/logger"; // Предполагается, что у вас настроен логгер для продакшена

// Типы для событий
interface JoinRoomPayload {
  currentUserId: string;
  toUserId: string;
}

interface SendMessagePayload {
  currentUserId: string;
  toUserId: string;
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
    transports: ["websocket", "polling"], // оптимизировано для продакшена
  });

  // Middleware для аутентификации WebSocket соединений
  io.use(socketAuthMiddleware);

  // Логика Socket.io
  io.on("connection", (socket: Socket & { user?: { _id: string } }) => {
    logger.info(`User connected: ${socket.id}`);

    if (socket.user?._id) {
      socket.join(socket.user._id);
    }

    socket.on("joinRoom", (payload: JoinRoomPayload) => {
      try {
        const { currentUserId, toUserId } = payload;
        if (!currentUserId || !toUserId) {
          throw new Error("Invalid payload for joinRoom");
        }
        const roomId = getRoomId(currentUserId, toUserId);
        socket.join(roomId);
        logger.info(`Socket ${socket.id} joined room ${roomId}`);
      } catch (error) {
        logger.error("Error in joinRoom:", error);
      }
    });

    socket.on("leaveRoom", (payload: JoinRoomPayload) => {
      try {
        const { currentUserId, toUserId } = payload;
        const roomId = getRoomId(currentUserId, toUserId);
        socket.leave(roomId);
        logger.info(`Socket ${socket.id} left room ${roomId}`);
      } catch (error) {
        logger.error("Error in leaveRoom:", error);
      }
    });

    socket.on("typing", (payload: JoinRoomPayload) => {
      try {
        const { currentUserId, toUserId } = payload;
        const roomId = getRoomId(currentUserId, toUserId);
        socket.to(roomId).emit("userTyping", { currentUserId });
      } catch (error) {
        logger.error("Error in typing:", error);
      }
    });

    socket.on("stopTyping", (payload: JoinRoomPayload) => {
      try {
        const { currentUserId, toUserId } = payload;
        const roomId = getRoomId(currentUserId, toUserId);
        socket.to(roomId).emit("userStopTyping", { currentUserId });
      } catch (error) {
        logger.error("Error in stopTyping:", error);
      }
    });

    socket.on("markAsRead", async (payload: JoinRoomPayload) => {
      try {
        const { currentUserId, toUserId } = payload;
        const roomId = getRoomId(currentUserId, toUserId);
        const chat = await Chat.findById(roomId);

        if (chat) {
          const prevUnread = chat.unreadMessages.get(currentUserId) || 0;
          chat.unreadMessages.set(currentUserId, 0);
          await chat.save();

          const diff = -prevUnread;
          // Отправляем diff текущему пользователю
          io.to(currentUserId).emit("newMessageNotification", { diff });
          // Обновляем сайдбар для всех участников
          io.emit("updateSidebar", {
            roomId,
            unreadMessages: Object.fromEntries(chat.unreadMessages),
          });
          logger.info(
            `MarkAsRead processed for room ${roomId} by ${currentUserId}`
          );
        }
      } catch (error) {
        logger.error("Error in markAsRead:", error);
      }
    });

    socket.on("sendMessage", async (payload: SendMessagePayload) => {
      const { currentUserId, toUserId, message, user } = payload;
      const roomId = getRoomId(currentUserId, toUserId);

      try {
        let chat = await Chat.findOne({
          _id: roomId,
          participants: { $all: [currentUserId, toUserId] },
        });

        if (!chat) {
          chat = new Chat({
            _id: roomId,
            participants: [currentUserId, toUserId],
            is_active: true,
            unreadMessages: toUserId ? new Map([[toUserId, 0]]) : new Map(),
          });
          await chat.save();
        }

        // Создаем сообщение до проверки подключения получателя
        const newMessage = new Message({
          sender: currentUserId,
          recipient: toUserId,
          text: message,
          timestamp: new Date(),
          status: "sent",
        });
        await newMessage.save();

        // Обновляем чат
        chat.messages.push(newMessage._id);
        chat.lastMessage = newMessage._id;

        // Проверяем, подключен ли получатель к комнате
        const room = io.sockets.adapter.rooms.get(roomId);
        const isRecipientConnected = room && room.size > 1;

        if (!isRecipientConnected && toUserId) {
          const unreadCount = chat.unreadMessages.get(toUserId) || 0;
          chat.unreadMessages.set(toUserId, unreadCount + 1);
          // Эмитим уведомление только если получатель не в комнате
          io.to(toUserId).emit("newMessageNotification", { newMessage, user });
        }

        await chat.save();

        // Отправляем событие в комнату
        io.in(roomId).emit("receiveMessage", newMessage);
        // Обновляем сайдбар для всех пользователей
        io.emit("updateSidebar", {
          roomId,
          lastMessage: newMessage,
          unreadMessages: Object.fromEntries(chat.unreadMessages),
        });

        logger.info(`Message sent in room ${roomId} from ${currentUserId}`);
      } catch (error) {
        logger.error("Error in sendMessage:", error);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};
