"use client";
import ChatRoom from "@/components/shared/chatRoom";
import SearchIcon from "@/components/svgs/search.svg";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import ArrowRightIcon from "@/components/svgs/arrow-right.svg";
import EditMenuIcon from "@/components/svgs/post-edit.svg";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/twMerge";

const ChatsPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement | null>(null);

  useClickOutside(popupRef, () => setShowPopup(false));

  return (
    <section className="m-[24px] flex h-[calc(100%-48px)] w-[1092px] border-[1px]">
      <div className="h-full w-[380px] border-r">
        <div className="relative h-[77px] w-[380px] border-b-[1px] px-5 py-4">
          <Input placeholder="Искать..." variant="second" />
          <SearchIcon className="absolute right-6 top-7" />
        </div>

        {/* chats list sidebar */}
        <div className="max-h-[calc(100vh-115px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit">
          {[...Array(10).keys()].map((index) => (
            <ChatRoom
              key={index}
              setSelectedRoom={setSelectedRoom}
              selectedRoom={selectedRoom}
              index={index + 1}
            />
          ))}
        </div>
      </div>

      {/*  chat room messages */}
      {selectedRoom ? (
        <div className="w-full">
          <div className="flex items-center justify-between border-b-[1px] px-5 py-4">
            <div
              onClick={() => setSelectedRoom(null)}
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active"
            >
              <ArrowRightIcon className="rotate-180" />
            </div>
            <div className="flex items-center gap-x-3">
              <img className="h-8 w-8" src="profile.png" />
              <h3>Кристина Локен</h3>
            </div>
            <div
              onClick={() => setShowPopup((prev) => !prev)}
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center border-[1px] hover:bg-active"
            >
              <EditMenuIcon className="rotate-90" />
              <div
                ref={popupRef as React.RefObject<HTMLDivElement>}
                className={cn(
                  "absolute mt-[80px] flex flex-col overflow-hidden bg-black text-[12px] font-bold duration-100",
                  {
                    "max-h-0": true,
                    "max-h-screen border p-1": showPopup,
                  },
                )}
              >
                <span
                  onClick={() => {
                    window.confirm(
                      "are you sure that you want to delete this chat?",
                    );
                  }}
                  className="hover:bg-primary"
                >
                  Delete
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-full px-5">
            <div className="absolute left-0 right-0 top-4 mx-auto flex h-[28px] w-[111px] items-center justify-center bg-active text-center text-[12px]">
              Сегондя
            </div>

            <div className="border-light-solid absolute bottom-24 w-[calc(100%-40px)] border-[1px]">
              <Input variant="second" placeholder="Напишите что-нибудь.." />
            </div>
          </div>
        </div>
      ) : (
        <h1 className="m-auto">Please select room to start chat</h1>
      )}
    </section>
  );
};

export default ChatsPage;
