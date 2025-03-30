"use client";
import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { formatDateHeader } from "@/utils/formatMessageTimeStamp";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import ArrowRightIcon from "@/components/svgs/arrow-right.svg";
import EditMenuIcon from "@/components/svgs/post-edit.svg";
import EnterIcon from "@/components/svgs/enter.svg";
import IsLoading from "../shared/loading";
import { getChatId } from "@/utils/getChatId";
import { useChatMessages } from "@/hooks/useChatMessage";
import { useMessageInput } from "@/hooks/useChatInput";
import MessageBubble from "./messageBubble";
import { Emoji } from "@emoji-mart/data";
import Link from "next/link";
import EmojiPickerWrapper from "../shared/emojiPickerWrapper";
import { IAuthor } from "@/@types/user";

export interface CustomEmoji extends Emoji {
  native: string;
  unified: string;
}

interface props extends IAuthor {
  setUser: Dispatch<SetStateAction<IAuthor | null>>;
}

const ChatBody: React.FC<props> = ({
  _id,
  first_name,
  second_name,
  img_url,
  setUser,
}) => {
  const currentUser = useAppSelector((state) => state.authSlice.user);
  const chatId = getChatId(currentUser._id, _id);
  const chatRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, otherUserTyping, sendMessage } = useChatMessages(
    chatId,
    currentUser,
    _id,
    chatRef,
  );

  const { message, setMessage, handleKeyDown } = useMessageInput(sendMessage);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[1px] px-5 py-4">
        <div
          onClick={() => setUser(null)}
          className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active"
        >
          <ArrowRightIcon className="rotate-180" />
        </div>
        <Link
          href={`/${_id}`}
          className="flex cursor-pointer items-center gap-x-3"
        >
          <Image
            width={32}
            height={32}
            className="rounded-[50%]"
            src={img_url || "/avatar.png"}
            alt="avatar"
          />
          <span>
            {first_name} {second_name}
          </span>
        </Link>
        <div className="relative flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active">
          <EditMenuIcon className="rotate-90" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative h-full pl-5 pr-1">
        <div
          ref={chatRef}
          className="flex max-h-[calc(100vh_-_235px)] flex-col gap-y-3 overflow-y-auto overflow-x-hidden pr-4 pt-[76px] scrollbar-thin scrollbar-webkit"
        >
          {isLoading ? (
            <IsLoading />
          ) : (
            messages?.map((message, index) => {
              const prevMessage = messages[index - 1];
              const nextMessage = messages[index + 1];

              const isSameSenderAsPrev =
                prevMessage && prevMessage.sender === message.sender;
              const isSameSenderAsNext =
                nextMessage && nextMessage.sender === message.sender;

              const isTimeCloseToPrev =
                prevMessage &&
                new Date(message.timestamp).getTime() -
                  new Date(prevMessage.timestamp).getTime() <
                  5 * 60 * 1000;

              const isTimeCloseToNext =
                nextMessage &&
                new Date(nextMessage.timestamp).getTime() -
                  new Date(message.timestamp).getTime() <
                  5 * 60 * 1000;

              const showAvatar = !isSameSenderAsPrev || !isTimeCloseToPrev;
              const showTimestamp = !isSameSenderAsNext || !isTimeCloseToNext;

              const showDateHeader =
                index === 0 ||
                new Date(prevMessage?.timestamp).toDateString() !==
                  new Date(message?.timestamp).toDateString();

              return (
                <div className="flex flex-col gap-y-5" key={index}>
                  {showDateHeader && (
                    <div className="mx-auto my-2 flex h-[28px] w-fit items-center justify-center rounded-md bg-gray-800 p-2 text-center text-sm text-gray-300">
                      {formatDateHeader(message?.timestamp)}
                      <Image
                        src="/down.svg"
                        width={16}
                        height={16}
                        alt="down"
                      />
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    isCurrentUser={message.sender === currentUser?._id}
                    showAvatar={showAvatar}
                    showTimestamp={showTimestamp}
                    user={
                      message.sender === currentUser?._id
                        ? {
                            first_name: currentUser.first_name,
                            second_name: currentUser.second_name,
                            img_url: currentUser.img_url,
                          }
                        : {
                            first_name: first_name,
                            second_name: second_name,
                            img_url: img_url,
                          }
                    }
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="absolute bottom-24 flex w-[calc(100%-40px)] items-center gap-x-3 border-[1px] bg-black p-4">
          <Image
            src={currentUser?.img_url || "/avatar.png"}
            className="rounded-[50%]"
            width={32}
            height={32}
            alt="avatar"
          />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="second"
            containerClassName="w-full"
            placeholder="Write a message..."
          />
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center hover:bg-active">
            <EmojiPickerWrapper handleInputChange={setMessage} />
          </div>
          <Button
            onClick={() => {
              sendMessage(message);
              setMessage("");
            }}
            className="w-[44px] p-[14px]"
          >
            <EnterIcon />
          </Button>
        </div>
        {otherUserTyping && (
          <div className="text-red absolute bottom-[185px] left-[40%] text-sm text-red-600">
            {first_name} is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBody;
