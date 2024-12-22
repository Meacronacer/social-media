"use client";
import Image from "next/image";
import CommentIcon from "@/components/svgs/comments.svg";
import LikeIcon from "@/components/svgs/like.svg";
import Comment from "./comment";
import EditIcon from "@/components/svgs/post-edit.svg";
import { useRef, useState } from "react";
import { cn } from "@/utils/twMerge";
import { useClickOutside } from "@/hooks/useClickOutside";

const Post = () => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLElement | null>(null);

  useClickOutside(popupRef, () => setShowPopup(false));

  return (
    <div className="relative flex w-full items-start gap-x-4 border-2 border-white p-5">
      <div className="absolute right-5 cursor-pointer">
        <EditIcon onClick={() => setShowPopup((prev) => !prev)} />
        <div
          ref={popupRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "absolute mt-2 flex flex-col overflow-hidden bg-black text-[12px] font-bold duration-100",
            {
              "max-h-0": true,
              "max-h-screen border p-1": showPopup,
            },
          )}
        >
          <span className="hover:bg-primary">Edit</span>
          <span className="hover:bg-primary">Delete</span>
        </div>
      </div>
      <Image src="/avatar.png" width={32} height={32} alt="avatar" />
      <div className="w-full">
        <div className="flex gap-x-2">
          <span className="text-[14px] font-bold">Райан Гослинг</span>
          <span className="text-[14px] font-medium text-white/50">
            2 часа назад
          </span>
        </div>
        <p className="text-[12px] font-medium leading-[133%]">
          Список навыков, который мы обсудили выше, — основа резюме,
          но не единственная его часть. Также можно рассказать о себе
          в классическом смысле — этот раздел можно добавить в сопроводительное
          письмо.
        </p>

        {/* count of comments and likes */}
        <div className="mt-6 flex gap-x-5 text-white">
          <div
            onClick={() => setShowComments((prev) => !prev)}
            className="flex cursor-pointer items-center gap-x-1"
          >
            <CommentIcon
              className={cn({
                "text-white": true,
                "text-primary": showComments,
              })}
            />
            <span className="text-[12px] font-bold">15</span>
          </div>
          <div className="flex cursor-pointer items-center gap-x-1">
            <LikeIcon />
            <span className="text-[12px] font-bold">28</span>
          </div>
        </div>

        {/* comments */}

        <div
          className={cn(
            "scrollbar-thin scrollbar-webkit flex h-full flex-col gap-y-5 overflow-y-auto pr-5 duration-500",
            {
              "max-h-0": true,
              "mt-5 max-h-[300px]": showComments,
            },
          )}
        >
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
        </div>
      </div>
    </div>
  );
};

export default Post;
