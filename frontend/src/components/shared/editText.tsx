import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useClickOutside } from "@/hooks/useClickOutside";
import useEmojiPickerPosition from "@/hooks/useEmojiPickerPosition";
import Portal from "./portal";
import Image from "next/image";
import EmojiPicker from "./emojiPicker";

interface props {
  text: string;
  submitEditTextFunc: (editedText: string) => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const EditText: React.FC<props> = ({
  text,
  submitEditTextFunc,
  setIsEditing,
  isLoading,
}) => {
  const [editedText, setEditedText] = useState<string>(text);

  const pickerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  // Используем хук с нужными настройками:
  // scaleFactor 0.8, pickerHeight 300, и корректирующие отступы для точного позиционирования
  const { pickerPosition, showPicker, setShowPicker, handleEmojiIconClick } =
    useEmojiPickerPosition(iconRef, {
      // Передаем ref в хук
      scaleFactor: 0.8,
      pickerHeight: 300,
      newTopMargin: 80,
      adjustments: { left: -285, top: -60 },
    });

  useClickOutside([pickerRef, iconRef], () => setShowPicker(false));

  const handleEmojiSelect = (emoji: any) => {
    setEditedText((prev) => prev + emoji.native);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex w-full gap-x-3">
        <Input
          containerClassName="border border-white py-1 px-2 w-full"
          value={editedText}
          className="text-[12px]"
          onChange={(e) => setEditedText(e.target.value)}
        />
        <Image
          ref={iconRef}
          onClick={handleEmojiIconClick}
          width={24}
          height={24}
          className="cursor-pointer duration-200 hover:scale-105"
          alt="emoji"
          src="/smile.svg"
        />
        {showPicker && (
          <Portal>
            <div
              ref={pickerRef} // Добавьте эту строку
              style={{
                position: "absolute",
                top: pickerPosition.top,
                left: pickerPosition.left,
                zIndex: 1000,
                transform: "scale(0.7)",
              }}
            >
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
          </Portal>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          className="h-8 w-20"
          variant="danger"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          disabled={editedText.length === 0 || editedText === text}
          className="h-8 w-20"
          onClick={() => submitEditTextFunc(editedText)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default EditText;
