"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EnterIcon from "../svgs/enter.svg";
import { useCreatePostMutation } from "@/api/postsApi";
import { useCreateCommentMutation } from "@/api/commentApi";
import { useAppSelector } from "@/hooks/useRedux";
import EmojiPickerWrapper from "../shared/emojiPickerWrapper";

interface Props {
  postId?: string;
  border?: string;
  isComment?: boolean;
}

const PostOrCommentForm: React.FC<Props> = ({
  postId,
  border = "border-2",
  isComment = false,
}) => {
  const [text, setText] = useState<string>("");
  const [createPost, { isLoading: postLoading }] = useCreatePostMutation();
  const [createComment, { isLoading: commentLoading }] =
    useCreateCommentMutation();
  const { _id: userId, img_url } = useAppSelector(
    (state) => state.authSlice.user,
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) return;

    if (text) {
      if (isComment && postId && userId) {
        createComment({
          userId,
          postId,
          text,
        })
          .unwrap()
          .then(() => setText(""))
          .catch(() => console.log());
      } else {
        createPost({ text, profileId: userId })
          .unwrap()
          .then(() => setText(""))
          .catch(() => console.log());
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`mb-4 flex h-[76px] items-center gap-x-3 ${border} border-white bg-black p-[16px]`}
    >
      <Image
        src={img_url || "/avatar.png"}
        className="h-8 w-8 rounded-[50%]"
        width={32}
        height={32}
        alt="avatar"
      />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        containerClassName="w-full"
        placeholder={isComment ? "Write a comment..." : "Write a post..."}
      />
      <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center duration-300 hover:bg-active">
        <EmojiPickerWrapper handleInputChange={setText} />
      </div>
      <Button
        disabled={postLoading || commentLoading}
        type="submit"
        className="w-[44px] justify-center p-[14px]"
      >
        <EnterIcon />
      </Button>
    </form>
  );
};

export default PostOrCommentForm;
