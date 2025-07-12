import { useEffect, useCallback, useState } from "react";
import { useGetAllActiveChatsQuery } from "@/api/chatsApi";
import { useSocket } from "@/providers/socketIoProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  addNewChat,
  updateChat,
  setActiveChats,
} from "@/redux/slices/chatSlice";
import { clearNewUser } from "@/redux/slices/chatSlice";
import { getChatId } from "@/utils/getChatId";
import { IAuthor } from "@/@types/user";
import { selectGetMeResult } from "@/redux/selectors/userSelector";

export const useChats = (debouncedSearchTerm: string) => {
  const [user, setUser] = useState<IAuthor | null>(null);
  const dispatch = useAppDispatch();
  const activeChats = useAppSelector((state) => state.chatSlice.activeChats);
  const { socket } = useSocket();
  const currentUserId = useAppSelector(selectGetMeResult)?.data?._id;
  const { _id, first_name, second_name, img_url } = useAppSelector(
    (state) => state.chatSlice.newUser,
  );

  const {
    data = [],
    isLoading: isChatsLoading,
    isSuccess,
    isFetching,
    refetch,
  } = useGetAllActiveChatsQuery(debouncedSearchTerm);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setActiveChats(data));
    }
  }, [data, isSuccess, dispatch]);

  // Обработка нового пользователя для создания чата
  useEffect(() => {
    if (_id && first_name && second_name && isSuccess) {
      const newUser = { _id, first_name, second_name, img_url };
      const chatId = getChatId(currentUserId, _id);
      // Если чат отсутствует, добавляем его в глобальное состояние

      console.log("check chat exist", chatId);
      if (!activeChats.some((chat) => chat._id === chatId)) {
        const newChat = {
          _id: chatId,
          participants: { _id, first_name, second_name, img_url },
          lastMessage: null,
          unreadMessages: {},
          // Добавьте другие необходимые поля чата
        };

        dispatch(addNewChat(newChat));
        setUser(newUser);
        dispatch(clearNewUser());
      }
    }
  }, [
    _id,
    first_name,
    second_name,
    img_url,
    isSuccess,
    dispatch,
    currentUserId,
    activeChats,
  ]);

  // Обработка сокет-события для обновления сайдбара
  useEffect(() => {
    socket?.on("updateSidebar", ({ roomId, lastMessage, unreadMessages }) => {
      dispatch(updateChat({ roomId, data: { lastMessage, unreadMessages } }));
    });

    refetch();
    return () => {
      socket?.off("updateSidebar");
      setUser(null);
    };
  }, [socket, dispatch, refetch]);

  const markAsRead = useCallback(
    (toUserId: string) => {
      if (socket && currentUserId && toUserId) {
        socket?.emit("markAsRead", {
          currentUserId,
          toUserId,
        });
      }
    },
    [socket, currentUserId],
  );

  return {
    markAsRead,
    user,
    setUser,
    activeChats,
    isChatsLoading: isChatsLoading || isFetching,
  };
};
