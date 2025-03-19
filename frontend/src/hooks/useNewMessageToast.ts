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

  // Обновляем счётчик, если данные из запроса изменились
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
      // Если пользователь не находится на странице чатов – показываем уведомление
      if (diff !== undefined) {
        setUnread((prev) => Math.max(0, prev + diff));
      } else if (newMessage) {
        // Если пришло новое сообщение и пользователь не в чате – показываем уведомление
        if (!pathname.startsWith(LinkTo.chats)) {
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
