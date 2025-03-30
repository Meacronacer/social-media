import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EmojiPickerWrapper from "./emojiPickerWrapper";

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

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex w-full gap-x-3">
        <Input
          containerClassName="border border-white py-1 px-2 w-full"
          value={editedText}
          className="text-[12px]"
          onChange={(e) => setEditedText(e.target.value)}
        />
        <EmojiPickerWrapper handleInputChange={setEditedText} />
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
