"use client";
// socketIoProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

// Типизация для контекста
interface SocketContextValue {
  socket: Socket | null;
}

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL

// Создаем контекст
const SocketContext = createContext<SocketContextValue>({ socket: null });

// Провайдер контекста
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Подключение сокета только на клиенте
      const socket = io(SERVER_URL, {
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Connected to socket server", socket.id);
        setIsSocketReady(true);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current = socket;

      // Очистка сокета при размонтировании компонента
      return () => {
        socket.disconnect();
        setIsSocketReady(false);
      };
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: isSocketReady ? socketRef.current : null }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Хук для использования контекста
export const useSocket = () => useContext(SocketContext);
