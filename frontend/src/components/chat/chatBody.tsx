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
import { useClickOutside } from "@/hooks/useClickOutside";
import useEmojiPickerPosition from "@/hooks/useEmojiPickerPosition";
import Portal from "../shared/portal";
import EmojiPicker from "../shared/emojiPicker";

interface ChatProps {
  setSelectedRoom: Dispatch<SetStateAction<string | null>>;
  toUserId: string | undefined;
  toFirstName?: string;
  toLastName?: string;
  toImgUrl?: string | undefined;
}

const ChatBody: React.FC<ChatProps> = ({
  setSelectedRoom,
  toUserId,
  toFirstName,
  toLastName,
  toImgUrl,
}) => {
  const currentUser = useAppSelector((state) => state.authSlice.user);
  const chatId = getChatId(currentUser._id, toUserId);
  const chatRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, otherUserTyping, sendMessage } = useChatMessages(
    chatId,
    currentUser,
    toUserId,
    chatRef,
  );

  const { message, handleInputChange, handleKeyDown } =
    useMessageInput(sendMessage);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Добавьте состояния и refs для emoji picker
  const pickerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  const { pickerPosition, showPicker, setShowPicker, handleEmojiIconClick } =
    useEmojiPickerPosition(iconRef, {
      // Передаем ref в хук
      scaleFactor: 0.8,
      pickerHeight: 300,
      adjustments: { left: -285, top: -30 },
    });

  useClickOutside([pickerRef, iconRef], () => setShowPicker(false));

  const handleEmojiSelect = (emoji: any) => {
    handleInputChange(emoji.native || emoji.unified); // Используем `native`, а если нет, `unified`
    setShowPicker(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[1px] px-5 py-4">
        <div
          onClick={() => setSelectedRoom(null)}
          className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active"
        >
          <ArrowRightIcon className="rotate-180" />
        </div>
        <div className="flex items-center gap-x-3">
          <Image
            width={32}
            height={32}
            className="rounded-[50%]"
            src={toImgUrl || "/avatar.png"}
            alt="avatar"
          />
          <h3>
            {toFirstName} {toLastName}
          </h3>
        </div>
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
                            first_name: toFirstName,
                            second_name: toLastName,
                            img_url: toImgUrl,
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            variant="second"
            containerClassName="w-full"
            placeholder="Write a message..."
          />
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center hover:bg-active">
            <Image
              ref={iconRef}
              onClick={handleEmojiIconClick}
              src="/smile.svg"
              width={24}
              height={24}
              alt="emoji"
            />

            {showPicker && (
              <Portal>
                <div
                  ref={pickerRef}
                  style={{
                    position: "fixed",
                    top: pickerPosition.top,
                    left: pickerPosition.left,
                    zIndex: 1000,
                    transform: "scale(0.8)",
                  }}
                >
                  <EmojiPicker onSelect={handleEmojiSelect} />
                </div>
              </Portal>
            )}
          </div>
          <Button
            onClick={() => sendMessage(message)}
            className="w-[44px] p-[14px]"
          >
            <EnterIcon />
          </Button>
        </div>
        {otherUserTyping && (
          <div className="text-red absolute bottom-[185px] left-[40%] text-sm text-red-600">
            {toFirstName} is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBody;
