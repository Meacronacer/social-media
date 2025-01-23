import { Server, Socket } from "socket.io";
import http from "http";
import socketAuthMiddleware from "./middlewares/socketIoAuth-middlware";

// Типы для событий
interface JoinRoomPayload {
  toUserId: string;
}

interface SendMessagePayload {
  currentUserId: string;
  toUserId: string;
  message: string;
  sender: string;
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
  io.on("connection", (socket: Socket & { user?: { id: string } }) => {
    console.log(`User connected: ${socket?.id}`);

    socket.on("joinRoom", (payload: JoinRoomPayload) => {
      const currentUser = socket?.user?.id;

      if (currentUser && payload.toUserId) {
        const roomId = getRoomId(currentUser, payload.toUserId);
        socket.join(roomId); // Подключаем пользователя к комнате
        console.log("current User id", currentUser, `joined roomId`, roomId);
      }
    });

    socket.on("sendMessage", (payload: SendMessagePayload) => {
      const { currentUserId, toUserId, message, sender } = payload;
      const roomId = getRoomId(currentUserId, toUserId);
      socket
        .to(roomId)
        .emit("receiveMessage", { fromUserId: currentUserId, message, sender });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
