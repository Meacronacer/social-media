"use client";
import { cn } from "@/utils/twMerge";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@/components/svgs/home.svg";
import ChatsIcon from "@/components/svgs/chats.svg";
import SearchIcon from "@/components/svgs/search.svg";
import ArrowRightIcon from "@/components/svgs/arrow-right.svg";
import SettingsIcon from "@/components/svgs/settings.svg";
import SubscriptionItem from "./subscriptionItem";
import { useGetMeQuery } from "@/api/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Iuser } from "@/@types/user";
import { useAppSelector } from "@/hooks/useRedux";

const nav = [
  { image: <HomeIcon />, label: "Моя страница", link: "/" },
  { image: <ChatsIcon />, label: "Чаты", link: "/chats" },
  { image: <SearchIcon />, label: "Поиск", link: "/search" },
  // ["/home.svg", "Моя страница", "/"],
  // ["/chats.svg", "Чаты", "/chats"],
  // ["/search.svg", "Поиск", "/search"],
];

const SideBar: React.FC = () => {
  const path = usePathname();
  const router = useRouter();

  const user = useAppSelector((state) => state.authSlice.user);

  return (
    <aside className="fixed flex h-screen w-full max-w-[300px] flex-col justify-between gap-y-5 border-r border-white/20 p-3">
      <div>
        <Image
          className="ml-4 mt-2"
          src="/logo.svg"
          width={61}
          height={74}
          alt="logo"
        />
        <nav className="mt-5">
          <ul className="flex flex-col gap-y-3">
            {nav.map((item) => (
              <li
                onClick={() => router.push(item.link)}
                key={item.label}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-active",
                  {
                    "bg-active text-primary": path === item.link,
                  },
                )}
              >
                <Link
                  className="flex h-[100%] w-full items-center gap-x-3 text-[14px] font-bold"
                  href={item.link}
                >
                  {item.image}
                  {item.label}
                </Link>
                {item.label === "Чаты" && (
                  <div className="h-[18px] w-[26px] bg-primary text-center text-[12px] font-bold text-black">
                    28
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <span className="ml-4 mt-5 block text-[12px] font-medium text-white/75">
          Подписчики
        </span>

        <div className="mt-5 flex flex-col gap-y-[6px] px-4">
          <SubscriptionItem image="/subs.png" name="Сара Коннор" />
          <SubscriptionItem image="/subs.png" name="Кристанна Локен" />
          <SubscriptionItem image="/subs.png" name="Майкл Уинслоу" />
        </div>

        <div className="group mt-5 flex cursor-pointer items-center gap-x-3 px-4 hover:text-primary">
          <span className="text-[12px] font-medium">Все подписчики</span>
          <ArrowRightIcon className="duration-300 group-hover:translate-x-5" />
        </div>
      </div>

      <Link
        href="/settings"
        className={cn(
          "flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-active",
          {
            "bg-active text-primary": path === "/settings",
          },
        )}
      >
        <div className="flex items-center gap-x-3">
          <img
            src={user?.img_url || "/subs.png"}
            className="h-8 w-8 rounded-[50%]"
          />
          {/* <Image
            src={data?.img_url || "/subs.png"}
            href=''
            width={32}
            height={32}
            alt="avatar"
          /> */}
          <span>
            {user?.first_name && `${user?.first_name}.${user?.second_name}`}
          </span>
        </div>
        <SettingsIcon />
      </Link>
    </aside>
  );
};

export default SideBar;
