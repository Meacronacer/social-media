"use client";

import { Iuser } from "@/@types/user";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useSubscribeMutation,
  useUnSubscribeMutation,
} from "@/api/subscriptions";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useRedux";
import Image from "next/image";
import React, { useState } from "react";
import SubscriptionItemSkeleton from "../skeletons/subscriptionsItemSkeleton";
import { useRouter } from "next/navigation";

type IUSER = Pick<Iuser, "_id" | "img_url" | "first_name" | "second_name">;

const SubscribersClientPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const userId = useAppSelector((state) => state.authSlice.user._id);
  const router = useRouter();
  const [subscribe] = useSubscribeMutation();
  const [unSubscribe] = useUnSubscribeMutation();

  // Получаем список подписчиков (followers) всегда, если есть userId
  const { data: followers = [], isLoading: loadingFollowers } =
    useGetFollowersQuery(userId, {
      skip: !userId,
    });

  // Получаем список подписок (following) всегда, если есть userId
  const { data: following = [], isLoading: loadingFollowing } =
    useGetFollowingQuery(userId, {
      skip: !userId,
    });

  // Функция для проверки взаимности подписки
  const isMutualFollow = (user: IUSER) => {
    return following.some((f: IUSER) => f._id === user._id);
  };

  const subscribeHandler = (_id: string | undefined) => {
    if (_id) {
      subscribe(_id).unwrap().catch();
    }
  };

  const UnsubscribeHandler = (_id: string | undefined) => {
    if (_id) {
      unSubscribe(_id).unwrap().catch();
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold capitalize">{activeTab}</h1>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab("followers")}
          className={`rounded px-4 py-2 ${
            activeTab === "followers"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          My Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`rounded px-4 py-2 ${
            activeTab === "following"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Following
        </button>
      </div>

      <div>
        {activeTab === "followers" && (
          <ul className="flex flex-col gap-y-1">
            {loadingFollowers && <li>Загрузка...</li>}
            {loadingFollowers ? (
              <>
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
              </>
            ) : (
              followers.map((user: IUSER) => (
                <li
                  key={user._id}
                  className="flex items-center gap-5 border-b p-4"
                >
                  <div className="flex w-[380px] items-center justify-between gap-3">
                    <div className="flex items-center gap-x-3">
                      <Image
                        onClick={() => router.push(`/${user._id}`)}
                        src={user.img_url || "/avatar.png"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="h-10 w-10 cursor-pointer rounded-full"
                      />
                      <span
                        onClick={() => router.push(`/${user._id}`)}
                        className="cursor-pointer text-lg"
                      >
                        {user.first_name} {user.second_name}
                      </span>
                    </div>
                    {isMutualFollow(user) ? (
                      <Button
                        onClick={() => UnsubscribeHandler(user._id)}
                        className="w-26 h-10"
                        variant="outline"
                      >
                        Following
                      </Button>
                    ) : (
                      <Button
                        onClick={() => subscribeHandler(user._id)}
                        className="w-26 h-10"
                        variant="danger"
                      >
                        Follow Back
                      </Button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
        {activeTab === "following" && (
          <ul className="flex flex-col gap-y-1">
            {loadingFollowing ? (
              <>
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
              </>
            ) : (
              following.map((user: IUSER) => (
                <li
                  key={user._id}
                  className="flex items-center gap-5 border-b p-4"
                >
                  <div className="flex w-[380px] items-center justify-between gap-3">
                    <div className="flex items-center gap-x-3">
                      <Image
                        onClick={() => router.push(`/${user._id}`)}
                        src={user.img_url || "/avatar.png"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="h-10 w-10 cursor-pointer rounded-full"
                      />
                      <span
                        onClick={() => router.push(`/${user._id}`)}
                        className="cursor-pointer text-lg"
                      >
                        {user.first_name} {user.second_name}
                      </span>
                    </div>
                    <Button
                      onClick={() => UnsubscribeHandler(user._id)}
                      className="w-26 h-10"
                      variant="outline"
                    >
                      Unsubscribe
                    </Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubscribersClientPage;
