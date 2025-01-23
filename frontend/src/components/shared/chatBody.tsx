// components/Chat.tsx
"use client";

import ArrowRightIcon from "@/components/svgs/arrow-right.svg";
import EditMenuIcon from "@/components/svgs/post-edit.svg";
import EnterIcon from "@/components/svgs/enter.svg";
import Image from "next/image";
import { cn } from "@/utils/twMerge";
import { useSocket } from "@/providers/socketIoProvider";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAppSelector } from "@/hooks/useRedux";
import MessageBubble from "./messageBubble";

interface ChatProps {
  setSelectedRoom: Dispatch<SetStateAction<string | null>>;
  toUserId: string | null;
  toFirstName?: string;
  toLastName?: string;
}

export interface Message {
  currentUserId: string;
  toUserId: string;
  message: string;
  sender: string;
}

const ChatBody: React.FC<ChatProps> = ({
  setSelectedRoom,
  toUserId,
  toFirstName,
  toLastName,
}) => {
  const { socket } = useSocket();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const currentUser = useAppSelector((state) => state.authSlice.user);

  useClickOutside(popupRef, () => setShowPopup(false));

  useEffect(() => {
    // Получение сообщений из сокета
    socket?.on("receiveMessage", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() && toUserId && currentUser.id) {
      // Отправка сообщения на сервер
      const newMessage = {
        currentUserId: currentUser.id,
        toUserId,
        message,
        sender: `${currentUser.first_name} ${currentUser.second_name}`,
      };

      socket?.emit("sendMessage", newMessage);

      // Добавление сообщения локально
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
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
          <img className="h-8 w-8" src="/avatar.png" alt="avatar" />
          <h3>
            {toFirstName} {toLastName}
          </h3>
        </div>
        <div
          onClick={() => setShowPopup((prev) => !prev)}
          className="relative flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active"
        >
          <EditMenuIcon className="rotate-90" />
          {showPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 mt-[80px] flex flex-col border bg-black p-1 text-[12px] font-bold"
            >
              <span
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this chat?")
                  ) {
                    setMessages([]);
                  }
                }}
                className="cursor-pointer hover:bg-primary"
              >
                Delete Chat
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative h-full pl-5 pr-1">
        <div className="absolute left-0 right-0 top-4 z-20 mx-auto flex h-[28px] w-[111px] items-center justify-center bg-active text-center text-[12px]">
          Today
        </div>

        <div className="flex max-h-[calc(100vh_-_235px)] flex-col gap-y-3 overflow-y-auto overflow-x-hidden pr-4 pt-[76px] scrollbar-thin scrollbar-webkit">
          {messages.map((item, index) => (
            <MessageBubble
              key={index}
              message={item}
              isCurrentUser={item.currentUserId === currentUser?.id}
            />
          ))}
        </div>

        {/* Message Input */}
        <div className="absolute bottom-24 flex w-[calc(100%-40px)] items-center gap-x-3 border-[1px] bg-black p-4">
          <Image src="/avatar.png" width={32} height={32} alt="avatar" />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="second"
            containerClassName="w-full"
            placeholder="Напишите что-нибудь"
          />
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center hover:bg-active">
            <Image src="/smile.svg" width={16} height={16} alt="emoji" />
          </div>
          <Button onClick={sendMessage} className="w-[44px] p-[14px]">
            <EnterIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
