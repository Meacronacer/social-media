"use client";
import { Button } from "@/components/ui/button";
import SettingsIcon from "@/components/svgs/settings.svg";
import Image from "next/image";
import EnterIcon from "@/components/svgs/enter.svg";
import PlusIcon from "@/components/svgs/plus.svg";
import Skill from "@/components/shared/skill";
import { useRouter } from "next/navigation";
import { LinkTo } from "@/utils/links";
import CreatePostForm from "../forms/PostOrCommentForm";
import { getProfileUserId } from "@/utils/getProfileUser";
import { setNewUser } from "@/redux/slices/chatSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import ProfileSkeleton from "../skeletons/profileSkeleton";
import {
  useGetRelationshipStatusQuery,
  useSubscribeMutation,
  useUnSubscribeMutation,
} from "@/api/subscriptions";
import { IAuthor } from "@/@types/user";
import PostsList from "./postsList";
import { useRef } from "react";

interface props {
  isOwnPage: boolean;
}

const ProfileSection: React.FC<props> = ({ isOwnPage }) => {
  const router = useRouter();
  const user = getProfileUserId(isOwnPage);
  const dispatch = useAppDispatch();
  const [subscribe, { isLoading: subIsLoading }] = useSubscribeMutation();
  const [unSubscribe, { isLoading: unSubIsLoading }] = useUnSubscribeMutation();
  const { data: related, isLoading: isRloading } =
    useGetRelationshipStatusQuery(user?._id, {
      skip: !user?._id || isOwnPage,
    });

  const handleSelectUser = () => {
    dispatch(setNewUser(user));
    router.push(LinkTo.chats);
  };

  const subscribeHandler = () => {
    if (!related?.isFollowing) {
      subscribe(user?._id).unwrap().then().catch();
    } else if (related?.isFollowing) {
      unSubscribe(user?._id).unwrap().then().catch();
    }
  };

  let subscribeLabel = "Follow";
  if (!related?.isFollowing && related?.isFollowedBy) {
    subscribeLabel = "Follow Back";
  } else if (related?.isFollowing) {
    subscribeLabel = "Unfollow";
  }

  return (
    <section className="w-[calc(screen_-_300px)] p-6">
      {/* top bar */}
      <section className="flex w-full items-center justify-between">
        {!user?._id ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex items-center gap-x-6">
            <Image
              width={140}
              height={140}
              alt="avatar"
              className="h-[140px] w-[140px] rounded-[50%]"
              src={user?.img_url || "/avatar.png"}
            />
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[24px] font-extrabold">
                {user?.first_name} {user?.second_name}
              </h1>
              <div className="flex items-center gap-x-5">
                <p className="font-bold">Posts 0</p>|
                <p className="cursor-pointer font-bold duration-300 hover:text-primary">
                  Following {user?.following?.length || 0}
                </p>
                <Button
                  isLoading={subIsLoading || unSubIsLoading}
                  onClick={subscribeHandler}
                  className={isOwnPage ? "invisible" : "visible"}
                  variant={related?.isFollowing ? "outline" : "danger"}
                >
                  {subscribeLabel}
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button
          onClick={() => {
            if (isOwnPage) {
              router.push(LinkTo.settings);
            } else {
              handleSelectUser();
            }
          }}
        >
          <span>{isOwnPage ? "Settings" : "Send message"}</span>
          {isOwnPage ? <SettingsIcon /> : <EnterIcon />}
        </Button>
      </section>

      <div className="mt-12 flex w-full animate-fade-in gap-x-[64px]">
        {/* posts */}
        <div className="flex w-full max-w-[65%] flex-col">
          {isOwnPage && <CreatePostForm img={user.img_url} />}

          <PostsList userId={user?._id} />
        </div>

        {/* subs */}
        <section className="w-[30%]">
          {user?.followers?.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-x-3">
                <span className="text-[18px] font-extrabold">Followers</span>
                <div className="bg-green-400 px-2 text-black">
                  {user?.followers?.length || 0}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-x-[6px]">
                {user?._id ? (
                  user?.followers?.map((item: IAuthor) => (
                    <Image
                      title={`${item?.first_name} ${item?.second_name}`}
                      onClick={() => router.push(`/${item?._id}`)}
                      key={item._id}
                      width={36}
                      height={36}
                      src={item?.img_url || "/avatar.png"}
                      alt="ava"
                      className="cursor-pointer rounded-full duration-200 hover:scale-105"
                    />
                  ))
                ) : (
                  <>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                    <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300"></div>
                  </>
                )}
                <div
                  onClick={() => router.push(LinkTo.search)}
                  className="flex cursor-pointer items-center justify-center p-1 duration-200 hover:scale-125"
                >
                  <PlusIcon />
                </div>
              </div>
            </>
          )}

          {/* skills */}

          {user?.skills?.length > 0 && (
            <span className="mt-8 block text-[18px] font-extrabold">
              Skills
            </span>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {user?.skills
              ?.slice(0, 20)
              .map((item: string, index: number) => (
                <Skill key={index} text={item} />
              ))}
          </div>

          {/* about yourself */}

          {user?.description && (
            <span className="mt-8 block text-[18px] font-extrabold">
              About myself
            </span>
          )}

          <p className="mt-4 text-[12px] font-medium">{user?.description}</p>
        </section>
      </div>
    </section>
  );
};

export default ProfileSection;
