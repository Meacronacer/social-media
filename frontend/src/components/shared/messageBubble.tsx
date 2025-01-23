import Image from "next/image";
import { Message } from "./chatBody";
import { cn } from "@/utils/twMerge";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <div
      className={cn("flex items-start gap-x-3", {
        "ml-auto": isCurrentUser,
      })}
    >
      {!isCurrentUser && (
        <Image src="/avatar.png" height={32} width={32} alt="avatar" />
      )}
      <div className="flex flex-col gap-y-1">
        <p className={cn("text-[12px]", { "text-right": isCurrentUser })}>
          {isCurrentUser ? <span className="mr-2">8:22</span> : null}
          {message.sender}
          {!isCurrentUser ? <span className="ml-2">8:22</span> : null}
        </p>
        <div
          className={cn("relative w-fit max-w-[461px] px-4 py-2", {
            "ml-auto bg-primary text-right text-black": isCurrentUser,
            "bg-[#404040] text-white": !isCurrentUser,
          })}
        >
          <p>{message.message}</p>
        </div>
      </div>
      {isCurrentUser && (
        <Image src="/avatar.png" height={32} width={32} alt="avatar" />
      )}
    </div>
  );
};

export default MessageBubble;
