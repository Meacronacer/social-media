"use client";

import { IAuthor } from "@/@types/user";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useSubscribeMutation,
  useUnSubscribeMutation,
} from "@/api/subscriptionsApi";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useRedux";
import Image from "next/image";
import React, { useState } from "react";
import SubscriptionItemSkeleton from "../skeletons/subscriptionsItemSkeleton";
import { useParams, useRouter } from "next/navigation";

const SubscribersClientPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const currentUser = useAppSelector((state) => state.authSlice.user);
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const [subscribe] = useSubscribeMutation();
  const [unSubscribe] = useUnSubscribeMutation();

  const { data: followers = [], isLoading: loadingFollowers } =
    useGetFollowersQuery(userId, { skip: !userId });
  const { data: following = [], isLoading: loadingFollowing } =
    useGetFollowingQuery(userId, { skip: !userId });

  // Функция для определения свойств кнопки в зависимости от отношений
  const getButtonProps = (user: IAuthor) => {
    // Не рендерим кнопку для собственного аккаунта
    if (user._id === currentUser?._id) {
      return null;
    }

    // Определяем, подписан ли текущий пользователь на данного пользователя
    const isFollowed = following?.some((u: IAuthor) => u._id === user._id);
    // Определяем, является ли данный пользователь подписчиком текущего пользователя
    const isFollower = followers?.some((u: IAuthor) => u._id === user._id);

    if (activeTab === "following") {
      return {
        text: isFollowed ? "Following" : "Follow",
        onClick: () => {
          if (user._id) {
            if (isFollowed) {
              unSubscribe(user._id).unwrap();
            } else {
              subscribe(user._id).unwrap();
            }
          }
        },
        variant: isFollowed ? ("outline" as const) : ("danger" as const),
      };
    }

    if (isFollowed) {
      return {
        text: "Following",
        onClick: () => {
          if (user._id) {
            unSubscribe(user._id).unwrap();
          }
        },
        variant: "outline" as const,
      };
    } else if (isFollower) {
      return {
        text: "Follow back",
        onClick: () => {
          if (user._id) {
            subscribe(user._id).unwrap();
          }
        },
        variant: "danger" as const,
      };
    } else {
      return {
        text: "Follow",
        onClick: () => {
          if (user._id) {
            subscribe(user._id).unwrap();
          }
        },
        variant: "danger" as const,
      };
    }
  };

  // Рендерим элемент списка пользователя
  const renderUserItem = (user: IAuthor) => {
    const buttonProps = getButtonProps(user);
    return (
      <li key={user._id} className="flex items-center gap-5 border-b p-4">
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
            <p
              title={`${user.first_name} ${user.second_name}`}
              onClick={() => router.push(`/${user._id}`)}
              className="cursor-pointer truncate whitespace-nowrap text-lg"
            >
              {user.first_name} {user.second_name}
            </p>
          </div>
          {buttonProps && (
            <Button onClick={buttonProps.onClick} variant={buttonProps.variant}>
              {buttonProps.text}
            </Button>
          )}
        </div>
      </li>
    );
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
          Followers
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
            {loadingFollowers ? (
              <>
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
                <SubscriptionItemSkeleton />
              </>
            ) : (
              followers.map(renderUserItem)
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
              following.map(renderUserItem)
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubscribersClientPage;
