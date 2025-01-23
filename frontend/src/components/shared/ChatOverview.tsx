import { cn } from "@/utils/twMerge";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface props {
  setSelectedRoom: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<
    SetStateAction<{ first_name: string; second_name: string } | null>
  >;
  selectedRoom: string | null;
  index: string;
  first_name: string | undefined;
  second_name: string | undefined;
  joinRoom: (toUserId: string) => void;
}

const ChatOverview: React.FC<props> = ({
  selectedRoom,
  setSelectedRoom,
  index,
  first_name,
  second_name,
  joinRoom,
  setUser,
}) => {
  return (
    <div
      onClick={() => {
        setSelectedRoom(index);
        joinRoom(index);
        if (first_name && second_name) {
          setUser({ first_name, second_name });
        }
      }}
      className={cn(
        "flex h-[128px] w-[380px] cursor-pointer items-start gap-x-4 border-b px-5 py-6",
        {
          "bg-black": true,
          "bg-white/10": selectedRoom === index,
        },
      )}
    >
      <Image width={32} height={32} src="/avatar.png" alt="avatar" />

      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between">
          <span className="text-light-transparent text-[12px]">
            {first_name} {second_name}
          </span>
          <span className="text-light-transparent text-[12px]">04.04.2024</span>
        </div>

        <div className="mt-3 flex">
          <p className="line-clamp-3 text-[12px] leading-[133%]">
            Терминаторы тестирую стенд, Готему нужен герой. За ангуляр только ты
            шаришь, хелп! Терминаторы тестирую стенд, Готему нужен герой. За
            ангуляр только ты шаришь, хелп!
          </p>
          <div className="text-dark-solid h-fit w-fit bg-primary px-[6px] py-[0px] text-[12px]">
            28
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverview;
