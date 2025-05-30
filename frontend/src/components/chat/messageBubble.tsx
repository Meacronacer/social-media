import Image from "next/image";
import { cn } from "@/utils/twMerge";
import { formatTimeForChatBody } from "@/utils/formatMessageTimeStamp";
import { IAuthor } from "@/@types/user";
import { IMessage } from "@/@types/message";

interface MessageBubbleProps {
  message: IMessage;
  isCurrentUser: boolean;
  user: Pick<IAuthor, "first_name" | "second_name" | "img_url">;
  showAvatar: boolean;
  showTimestamp: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  user,
  showAvatar,
  showTimestamp,
}) => {
  return (
    <div
      className={cn("flex items-start gap-x-3", { "ml-auto": isCurrentUser })}
    >
      <div className="h-8 w-8">
        {!isCurrentUser && showAvatar && (
          <Image
            src={user?.img_url || "/avatar.png"}
            height={32}
            width={32}
            alt="avatar"
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        {showAvatar && (
          <p className={cn("text-[12px]", { "text-right": isCurrentUser })}>
            {user?.first_name} {user?.second_name}
          </p>
        )}
        <div
          className={cn("relative w-fit max-w-[461px] px-4 py-2", {
            "ml-auto bg-primary text-right text-black": isCurrentUser,
            "bg-[#404040] text-white": !isCurrentUser,
            "mr-11": isCurrentUser && !showAvatar,
          })}
        >
          <p>{message?.text}</p>
        </div>
        {showTimestamp && (
          <span
            className={cn("mt-1 text-[12px] text-gray-300", {
              "text-right": isCurrentUser,
              "mr-11": isCurrentUser && !showAvatar,
            })}
          >
            {formatTimeForChatBody(message?.timestamp)}
          </span>
        )}
      </div>
      {isCurrentUser && showAvatar && (
        <Image
          src={user?.img_url || "/avatar.png"}
          height={32}
          width={32}
          alt="avatar"
          className="rounded-full"
        />
      )}
    </div>
  );
};

export default MessageBubble;
