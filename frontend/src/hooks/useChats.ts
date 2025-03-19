"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useGetAllActiveChatsQuery } from "@/api/chats";
import { useSocket } from "@/providers/socketIoProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { clearNewUser } from "@/redux/slices/chatSlice";
import { getChatId } from "@/utils/getChatId";

export const useChats = (debouncedSearchTerm: string) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const activeChatsRef = useRef<any[]>([]); // Ссылка на актуальные чаты
  const [user, setUser] = useState<{
    _id: string;
    first_name: string;
    second_name: string;
    img_url: string | undefined;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const currentUserId = useAppSelector((state) => state.authSlice.user?._id);
  const { _id, first_name, second_name, img_url } = useAppSelector(
    (state) => state.chatSlice.newUser,
  );

  const {
    data = [],
    isLoading: isChatsLoading, // Переименуем для ясности
    isSuccess,
    isFetching, // Добавляем отслеживание состояния запроса
  } = useGetAllActiveChatsQuery(debouncedSearchTerm);

  useEffect(() => {
    if (data && isSuccess) {
      setActiveChats(data);
      activeChatsRef.current = data; // Обновляем ссылку на актуальные чаты
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (_id && first_name && second_name && isSuccess) {
      const newUser = { _id, first_name, second_name, img_url };
      const chatId = getChatId(currentUserId, _id);

      // Проверяем наличие чата по ссылке, а не по стейту
      const exists = activeChatsRef.current.some((chat) => chat._id === chatId);

      if (!exists) {
        setActiveChats((prevChats) => {
          const updatedChats = [
            { _id: chatId, participants: newUser },
            ...prevChats,
          ];
          activeChatsRef.current = updatedChats; // Обновляем ссылку на актуальные чаты
          return updatedChats;
        });
        dispatch(clearNewUser());
      }

      setUser(newUser);
      setSelectedRoom(_id);
      joinRoom(_id, true);
    }
  }, [_id, first_name, second_name, img_url, isSuccess, dispatch]);

  useEffect(() => {
    socket?.on("updateSidebar", ({ roomId, lastMessage, unreadMessages }) => {
      setActiveChats((prev) => {
        const updatedChats = prev.map((chat) =>
          chat._id === roomId
            ? {
                ...chat,
                lastMessage: lastMessage ?? chat.lastMessage,
                unreadMessages,
              }
            : chat,
        );
        // Сортируем чаты по времени последнего сообщения (от новых к старым)
        updatedChats.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const timeB = b.lastMessage?.timestamp
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return timeB - timeA;
        });
        activeChatsRef.current = updatedChats;
        return updatedChats;
      });
    });

    return () => {
      socket?.off("updateSidebar");
    };
  }, [socket]);

  const joinRoom = useCallback(
    (toUserId: string, createNewChat = false) => {
      socket?.emit("joinRoom", { currentUserId, toUserId });

      if (!createNewChat) {
        setActiveChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.participants._id === toUserId
              ? { ...chat, unreadCount: 0 }
              : chat,
          );

          activeChatsRef.current = updatedChats; // Обновляем ссылку на актуальные чаты
          return updatedChats;
        });

        if (currentUserId) {
          socket?.emit("markAsRead", { currentUserId, toUserId });
        }
      }
    },
    [socket, currentUserId],
  );

  return {
    selectedRoom,
    setSelectedRoom,
    activeChats,
    setActiveChats,
    user,
    isChatsLoading: isChatsLoading || isFetching,
    setUser,
    joinRoom,
  };
};
