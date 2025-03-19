"use client";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EnterIcon from "../svgs/enter.svg";
import { useCreatePostMutation } from "@/api/posts";
import { useCreateCommentMutation } from "@/api/comment";
import { useAppSelector } from "@/hooks/useRedux";
import EmojiPicker from "../shared/emojiPicker";
import Portal from "../shared/portal"; // Компонент портала
import { useClickOutside } from "@/hooks/useClickOutside";
import useEmojiPickerPosition from "@/hooks/useEmojiPickerPosition";

interface Props {
  postId?: string;
  img: string | undefined;
  border?: string;
  isComment?: boolean;
}

const CreatePostForm: React.FC<Props> = ({
  img,
  postId,
  border = "border-2",
  isComment = false,
}) => {
  const [text, setText] = useState<string>("");
  const [createPost] = useCreatePostMutation();
  const [createComment] = useCreateCommentMutation();
  const userId = useAppSelector((state) => state.authSlice.user._id);

  // Закрываем пикер при клике вне его области
  const pickerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  // Используем хук с нужными настройками:
  // scaleFactor 0.8, pickerHeight 300, и корректирующие отступы для точного позиционирования
  const { pickerPosition, showPicker, setShowPicker, handleEmojiIconClick } =
    useEmojiPickerPosition(iconRef, {
      // Передаем ref в хук
      scaleFactor: 0.8,
      pickerHeight: 300,
      adjustments: { left: -285, top: -30 },
    });

  useClickOutside([pickerRef, iconRef], () => setShowPicker(false));

  const handleEmojiSelect = (emoji: any) => {
    setText((prev) => prev + emoji.native);
    setShowPicker(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text) {
      if (isComment) {
        createComment({
          userId,
          postId,
          text,
        })
          .unwrap()
          .then(() => setText(""))
          .catch((err) => console.log(err));
      } else {
        createPost({ text })
          .unwrap()
          .then(() => setText(""))
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`mb-4 flex h-[76px] items-center gap-x-3 ${border} border-white bg-black p-[16px]`}
    >
      <Image
        src={img || "/avatar.png"}
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
        <Image
          ref={iconRef}
          onClick={handleEmojiIconClick}
          width={24}
          height={24}
          alt="emoji"
          src="/smile.svg"
        />
      </div>
      <Button type="submit" className="w-[44px] justify-center p-[14px]">
        <EnterIcon />
      </Button>
      {showPicker && (
        <Portal>
          <div
            ref={pickerRef} // Добавьте эту строку
            style={{
              position: "absolute",
              top: pickerPosition.top,
              left: pickerPosition.left,
              zIndex: 1000,
              transform: "scale(0.8)",
            }}
          >
            <EmojiPicker onSelect={handleEmojiSelect} />
          </div>
        </Portal>
      )}
    </form>
  );
};

export default CreatePostForm;
