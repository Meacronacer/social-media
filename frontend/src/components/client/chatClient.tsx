"use client";
import ChatOverview from "@/components/chat/ChatOverview";
import SearchIcon from "@/components/svgs/search.svg";
import { Input } from "@/components/ui/input";
import ChatBody from "@/components/chat/chatBody";
import { useChats } from "@/hooks/useChats";
import ChatOverviewSkeleton from "../skeletons/chatOverviewSkeleton";
import { useState, useEffect, useRef } from "react";

const ChatClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null); // 1. Указываем правильный тип для браузера

  const {
    activeChats,
    isChatsLoading: isChatsLoading,
    user,
    setUser,
    markAsRead,
  } = useChats(debouncedSearchTerm);

  useEffect(() => {
    setIsLocalLoading(true);

    // 2. Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 3. Сохраняем ID таймера правильно
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsLocalLoading(false);
    }, 1000);

    return () => {
      // 4. Безопасная очистка при размонтировании
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchTerm]);

  const isLoading = isChatsLoading || isLocalLoading;

  return (
    <section className="m-[24px] flex h-[calc(100vh-48px)] w-[1092px] border-[1px]">
      <div className="h-full w-[380px] border-r">
        <div className="relative h-[77px] w-[380px] border-b-[1px] px-5 py-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            variant="second"
          />
          {searchTerm ? (
            <div
              title="press to clear search input"
              onClick={() => setSearchTerm("")}
              className="absolute right-6 top-5 cursor-pointer text-[20px] duration-300 hover:scale-125"
            >
              x
            </div>
          ) : (
            <SearchIcon className="absolute right-6 top-7" />
          )}
        </div>
        <div className="max-h-[calc(100vh-115px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit">
          {isLoading ? (
            <div className="animate-fade-in">
              {[1, 2].map((i) => (
                <ChatOverviewSkeleton
                  key={i}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeChats.map((item, index) => (
                <div
                  key={item._id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <ChatOverview
                    participants={item.participants}
                    lastMessage={item.lastMessage}
                    unreadMessages={item.unreadMessages}
                    markAsRead={markAsRead}
                    selectedUserId={user?._id}
                    setUser={setUser}
                  />
                </div>
              ))}
              {searchTerm && activeChats.length === 0 && (
                <p className="animate-fade-in p-4 text-center text-gray-500">
                  No chats found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {user?._id ? (
        <ChatBody {...user} setUser={setUser} />
      ) : (
        <h1 className="m-auto">Please select room to start chat</h1>
      )}
    </section>
  );
};

export default ChatClient;
