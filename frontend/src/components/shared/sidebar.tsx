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
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { LinkTo } from "@/utils/links";
import { useGetMeQuery } from "@/api/userApi";
import { setUser } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import SubscriptionItemSkeleton from "../skeletons/subscriptionsItemSkeleton";
import useUnreadCount from "@/hooks/useNewMessageToast";

const nav = [
  { image: <HomeIcon />, label: "Profile", link: LinkTo.home },
  { image: <ChatsIcon />, label: "Chats", link: LinkTo.chats },
  { image: <SearchIcon />, label: "Search", link: LinkTo.search },
];

const SideBar: React.FC = () => {
  const path = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: user = null, isLoading, isSuccess } = useGetMeQuery();
  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user)); // Сохраняем данные пользователя в Redux
    }
  }, [isSuccess, user, dispatch]);

  useUnreadCount();

  const globalUnread = useAppSelector((state) => state.chatSlice.totalUnread);

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
                {"/" + item.label.toLowerCase() === LinkTo.chats &&
                  globalUnread > 0 && (
                    <div className="h-[18px] w-[26px] bg-primary text-center text-[12px] font-bold text-black">
                      {globalUnread}
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </nav>

        {user?.followers && user?.followers.length > 0 && (
          <span className="ml-4 mt-5 block text-[12px] font-medium text-white/75">
            Followers
          </span>
        )}

        <div className="mt-5 flex flex-col gap-y-[6px] px-4">
          {isLoading ? (
            <>
              <SubscriptionItemSkeleton />
              <SubscriptionItemSkeleton />
              <SubscriptionItemSkeleton />
            </>
          ) : (
            user?.followers.map((item) => (
              <SubscriptionItem key={item._id} {...item} />
            ))
          )}
        </div>

        {user?.followers && user?.followers?.length > 0 && (
          <div
            onClick={() => router.push(`${LinkTo.subscribers}/${user._id}`)}
            className="group mt-5 flex cursor-pointer items-center gap-x-3 px-4 hover:text-primary"
          >
            <span className="text-[12px] font-medium">All Followers</span>
            <ArrowRightIcon className="duration-300 group-hover:translate-x-5" />
          </div>
        )}
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
          <Image
            width={32}
            height={32}
            alt="avatar"
            src={user?.img_url || "/avatar.png"}
            className="h-8 w-8 rounded-[50%]"
          />
          {isLoading ? (
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <span className="lowercase">
              {user?.first_name && `${user?.first_name}.${user?.second_name}`}
            </span>
          )}
        </div>
        <SettingsIcon />
      </Link>
    </aside>
  );
};

export default SideBar;
