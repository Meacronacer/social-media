"use client";

import { Ichat } from "@/@types/chat";
import { IAuthor } from "@/@types/user";
import { useAppSelector } from "@/hooks/useRedux";
import { formatMessageTimestamp } from "@/utils/formatMessageTimeStamp";
import { cn } from "@/utils/twMerge";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface props {
  participants: Ichat["participants"];
  lastMessage: Ichat["lastMessage"];
  unreadMessages: Ichat["unreadMessages"];
  setUser: Dispatch<SetStateAction<IAuthor | null>>;
  selectedUserId: string | undefined;
  markAsRead: (toUserId: string) => void;
}

const ChatOverview: React.FC<props> = ({
  unreadMessages,
  participants,
  lastMessage,
  setUser,
  markAsRead,
  selectedUserId,
}) => {
  const currentUserId = useAppSelector((state) => state.authSlice.user?._id);

  if (!participants) return null;

  const { _id, first_name, second_name, img_url } = participants;

  return (
    <div
      onClick={() => {
        if (_id && first_name && second_name) {
          setUser({ _id, first_name, second_name, img_url });
          markAsRead(_id);
        }
      }}
      className={cn(
        "flex h-[128px] w-[380px] cursor-pointer items-start gap-x-4 border-b px-5 py-6",
        {
          "bg-black": true,
          "bg-white/10": selectedUserId === _id,
        },
      )}
    >
      <Image
        width={32}
        height={32}
        className="rounded-[50%]"
        src={img_url || "/avatar.png"}
        alt="/avatar"
      />

      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between">
          <span className="text-light-transparent text-[12px]">
            {first_name} {second_name}
          </span>
          <span className="text-light-transparent text-[12px]">
            {lastMessage && formatMessageTimestamp(lastMessage?.timestamp)}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <p className="line-clamp-3 text-[12px] leading-[133%]">
            {lastMessage?.text && (
              <span
                className={
                  lastMessage.sender === currentUserId
                    ? "text-primary"
                    : "text-red-400"
                }
              >
                {currentUserId === lastMessage.sender
                  ? "You:"
                  : first_name + ":"}
              </span>
            )}
            {lastMessage?.text.trim()}
          </p>
          <div className="text-dark-solid h-fit w-fit bg-primary px-[6px] py-[0px] text-[12px]">
            {unreadMessages &&
              currentUserId &&
              unreadMessages[currentUserId] > 0 &&
              unreadMessages[currentUserId]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverview;
