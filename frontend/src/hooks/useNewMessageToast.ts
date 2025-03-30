import { useEffect } from "react";
import { useGetUnreadMessagesCountQuery } from "@/api/chatsApi";
import { useSocket } from "@/providers/socketIoProvider";
import { usePathname } from "next/navigation";
import useToastify from "@/hooks/useToastify";
import { LinkTo } from "@/utils/links";
import { useAppDispatch } from "@/hooks/useRedux";
import { changeUnreadCount, updateUnreadCount } from "@/redux/slices/chatSlice";
import { Iuser } from "@/@types/user";
import { IMessage } from "@/@types/message";

const useUnreadCount = () => {
  const { socket } = useSocket();
  const { data } = useGetUnreadMessagesCountQuery();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { toastNewMessage } = useToastify();

  // При загрузке актуализируем общее количество непрочитанных из API
  useEffect(() => {
    if (data && typeof data.totalUnread === "number") {
      dispatch(updateUnreadCount(data.totalUnread));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = ({
      user,
      newMessage,
      diff,
    }: {
      user: Iuser;
      newMessage: IMessage;
      diff: number;
    }) => {
      if (typeof diff === "number" && diff !== 0) {
        dispatch(changeUnreadCount(diff));
      } else if (newMessage) {
        if (
          !pathname.startsWith(LinkTo.chats) &&
          localStorage.getItem("switchState") !== "true"
        ) {
          toastNewMessage(user, newMessage.text);
        }
        dispatch(changeUnreadCount(1));
      }
    };

    socket.on("newMessageNotification", handleReceiveMessage);

    return () => {
      socket.off("newMessageNotification", handleReceiveMessage);
    };
  }, [socket, pathname, toastNewMessage, dispatch]);
};

export default useUnreadCount;
