"use client";
import { useEffect, useState } from "react";
import { useGetUnreadMessagesCountQuery } from "@/api/chats";
import { useSocket } from "@/providers/socketIoProvider";
import { usePathname } from "next/navigation";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";
import { Message } from "@/components/chat/messageBubble";
import { Iuser } from "@/@types/user";

const useUnreadCount = () => {
  const { socket } = useSocket();
  const { data } = useGetUnreadMessagesCountQuery();
  const [unread, setUnread] = useState<number>(data?.totalUnread || 0);
  const pathname = usePathname();
  const { toastNewMessage } = useToastify();

  // Функция для проверки состояния уведомлений
  const areNotificationsEnabled = () => {
    try {
      return localStorage.getItem("switchState") === "true";
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return false;
    }
  };

  useEffect(() => {
    if (data) {
      setUnread(data.totalUnread);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = ({
      user,
      newMessage,
      diff,
    }: {
      user: Iuser;
      newMessage: Message;
      diff: number;
    }) => {
      // Проверяем состояние переключателя перед обработкой

      if (diff !== undefined) {
        setUnread((prev) => Math.max(0, prev + diff));
      } else if (newMessage) {
        if (!pathname.startsWith(LinkTo.chats) && !areNotificationsEnabled()) {
          toastNewMessage(user, newMessage.text);
        }
        setUnread((prev) => prev + 1);
      }
    };

    socket.on("newMessageNotification", handleReceiveMessage);

    return () => {
      socket.off("newMessageNotification", handleReceiveMessage);
    };
  }, [socket, pathname, toastNewMessage]);

  return unread;
};

export default useUnreadCount;
