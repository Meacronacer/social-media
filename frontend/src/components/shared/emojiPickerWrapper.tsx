// components/shared/EmojiPickerWrapper.tsx
"use client";
import { Dispatch, SetStateAction, useRef } from "react";
import Portal from "../shared/portal";
import EmojiPicker from "../shared/emojiPicker";
import { useClickOutside } from "@/hooks/useClickOutside";
import useEmojiPickerPosition from "@/hooks/useEmojiPickerPosition";
import { Emoji } from "@emoji-mart/data";
import Image from "next/image";

export interface CustomEmoji extends Emoji {
  native: string;
  unified: string;
}

interface EmojiPickerWrapperProps {
  handleInputChange: Dispatch<SetStateAction<string>>;
}

const EmojiPickerWrapper: React.FC<EmojiPickerWrapperProps> = ({
  handleInputChange,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  const { pickerPosition, showPicker, setShowPicker, handleEmojiIconClick } =
    useEmojiPickerPosition(iconRef, {
      scaleFactor: 0.8,
      pickerHeight: 300,
      adjustments: { left: -285, top: -30 },
    });

  useClickOutside([pickerRef, iconRef], () => setShowPicker(false));

  const handleEmojiSelect = (emoji: CustomEmoji) => {
    handleInputChange((prev: string) => prev + (emoji.native || emoji.unified));
    setShowPicker(false);
  };

  return (
    <>
      <Image
        ref={iconRef}
        onClick={handleEmojiIconClick}
        src="/smile.svg"
        alt="emoji"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      {showPicker && (
        <Portal>
          <div
            ref={pickerRef}
            style={{
              position: "absolute",
              top: pickerPosition.top,
              left: pickerPosition.left,
              zIndex: 1000,
              transform: "scale(0.8)",
            }}
          >
            <EmojiPicker handleEmojiSelect={handleEmojiSelect} />
          </div>
        </Portal>
      )}
    </>
  );
};

export default EmojiPickerWrapper;
