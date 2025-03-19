import { useEffect, useState, useCallback, RefObject } from "react";
import { useSocket } from "@/providers/socketIoProvider";
import {
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
} from "@/api/chats";
import { Message } from "@/components/chat/messageBubble";
import { Iuser } from "@/@types/user";

export const useChatMessages = (
  chatId: string,
  senderUser: Iuser,
  recipientUserId: string | undefined,
  chatRef: RefObject<HTMLDivElement | null>,
) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Новое состояние

  const { data, isLoading } = useGetChatMessagesQuery({ chatId, limit: 10 });
  const [fetchMoreMessages] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
      setHasMore(data.hasMore);
    }
  }, [data]);

  useEffect(() => {
    socket?.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket?.on("userTyping", () => {
      setOtherUserTyping(true);
    });

    socket?.on("userStopTyping", () => {
      setOtherUserTyping(false);
    });

    return () => {
      socket?.off("receiveMessage");
      socket?.off("userTyping");
      socket?.off("userStopTyping");
    };
  }, [socket]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || messages.length === 0 || isLoadingMore) return; // Проверяем, выполняется ли уже загрузка
    setIsLoadingMore(true); // Устанавливаем флаг загрузки

    const chatElement = chatRef.current;
    if (!chatElement) return;

    const previousScrollHeight = chatElement.scrollHeight;
    const previousScrollTop = chatElement.scrollTop;

    const lastMessageId = messages[0]._id;
    const { data } = await fetchMoreMessages({
      chatId,
      lastMessageId,
      limit: 10,
    });

    if (data?.messages.length) {
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);

      requestAnimationFrame(() => {
        chatElement.scrollTop =
          chatElement.scrollHeight - previousScrollHeight + previousScrollTop;
      });
    }

    setIsLoadingMore(false); // Сбрасываем флаг загрузки
  }, [messages, hasMore, fetchMoreMessages, isLoadingMore]);

  useEffect(() => {
    const chatElement = chatRef.current;
    if (!chatElement) return;

    const handleScroll = () => {
      if (chatElement.scrollTop <= 300 && !isLoadingMore) {
        loadMoreMessages();
      }
    };

    chatElement.addEventListener("scroll", handleScroll);

    return () => {
      chatElement.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreMessages, isLoadingMore]);

  const sendMessage = useCallback(
    (message: string) => {
      const { _id, first_name, second_name, img_url } = senderUser;
      if (message.trim() && recipientUserId && _id) {
        socket?.emit("sendMessage", {
          senderUserId: _id,
          recipientUserId,
          message,
          user: { first_name, second_name, img_url },
        });
      }
    },
    [socket, recipientUserId, senderUser],
  );

  return {
    messages,
    isLoading,
    otherUserTyping,
    sendMessage,
  };
};
