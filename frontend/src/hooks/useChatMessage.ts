import { useEffect, useState, useCallback, RefObject } from "react";
import { useSocket } from "@/providers/socketIoProvider";
import {
  useGetChatMessagesQuery,
  useLazyGetChatMessagesQuery,
} from "@/api/chatsApi";

import { Iuser } from "@/@types/user";
import { IMessage } from "@/@types/message";

export const useChatMessages = (
  chatId: string,
  currentUser: Iuser,
  toUserId: string | undefined,
  chatRef: RefObject<HTMLDivElement | null>,
) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Новое состояние

  const { data, isLoading, isError } = useGetChatMessagesQuery(
    {
      chatId,
      limit: 20,
    },
    { refetchOnMountOrArgChange: true },
  );
  const [fetchMoreMessages] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
      setHasMore(data.hasMore);
    }

    if (isError) {
      setMessages([]);
    }
  }, [data, isError]);

  useEffect(() => {
    socket?.emit("joinRoom", {
      currentUserId: currentUser._id,
      toUserId,
    });

    socket?.on("receiveMessage", (newMessage: IMessage) => {
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
      socket?.emit("leaveRoom", { currentUserId: currentUser._id, toUserId });
    };
  }, [socket, currentUser?._id, toUserId]);

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
      limit: 20,
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
  }, [messages, hasMore, fetchMoreMessages, isLoadingMore, chatId, chatRef]);

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
  }, [loadMoreMessages, isLoadingMore, chatRef]);

  const sendMessage = useCallback(
    (message: string) => {
      const { _id, first_name, second_name, img_url } = currentUser;
      if (message.trim() && toUserId && _id) {
        socket?.emit("sendMessage", {
          currentUserId: _id,
          toUserId,
          message,
          user: { _id, first_name, second_name, img_url },
        });
      }
    },
    [socket, toUserId, currentUser],
  );

  return {
    messages,
    isLoading,
    otherUserTyping,
    sendMessage,
  };
};
