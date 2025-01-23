"use client";
import ChatOverview from "@/components/shared/ChatOverview";
import SearchIcon from "@/components/svgs/search.svg";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import ChatBody from "@/components/shared/chatBody";
import { useGetAllUsersQuery } from "@/api/auth";
import { useSocket } from "@/providers/socketIoProvider";

const ChatsPage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState<{
    first_name: string;
    second_name: string;
  } | null>(null);
  const { data = [], isLoading } = useGetAllUsersQuery({});
  const { socket } = useSocket();

  const joinRoom = (toUserId: string) => {
    socket?.emit("joinRoom", { toUserId });
  };

  return (
    <section className="m-[24px] flex h-[calc(100vh-48px)] w-[1092px] border-[1px]">
      <div className="h-full w-[380px] border-r">
        <div className="relative h-[77px] w-[380px] border-b-[1px] px-5 py-4">
          <Input placeholder="Искать..." variant="second" />
          <SearchIcon className="absolute right-6 top-7" />
        </div>

        {/* chats list sidebar */}
        <div className="max-h-[calc(100vh-115px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit">
          {data.map((item: any, index: any) => (
            <ChatOverview
              first_name={item?.first_name}
              second_name={item?.second_name}
              setSelectedRoom={setSelectedRoom}
              selectedRoom={selectedRoom}
              setUser={setUser}
              index={item?._id}
              key={index}
              joinRoom={joinRoom}
            />
          ))}
        </div>
      </div>

      {/*  chat room messages */}
      {selectedRoom ? (
        <ChatBody
          setSelectedRoom={setSelectedRoom}
          toUserId={selectedRoom}
          toFirstName={user?.first_name}
          toLastName={user?.second_name}
        />
      ) : (
        <h1 className="m-auto">Please select room to start chat</h1>
      )}
    </section>
  );
};

export default ChatsPage;
