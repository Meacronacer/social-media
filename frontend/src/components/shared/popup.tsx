"use client";
import EditIcon from "@/components/svgs/post-edit.svg";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/twMerge";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface props {
  deletePostOrCommentFunc: () => void;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  canEdit?: boolean;
}

const Popup: React.FC<props> = ({
  deletePostOrCommentFunc,
  canEdit,
  setIsEditing,
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useClickOutside([popupRef], () => setShowPopup(false));

  return (
    <>
      <EditIcon onClick={() => setShowPopup((prev) => !prev)} />
      <div
        ref={popupRef as React.RefObject<HTMLDivElement>}
        className={cn(
          "absolute right-0 mt-2 flex flex-col overflow-hidden bg-black pr-4 text-[12px] font-bold duration-100",
          {
            "max-h-0": true,
            "max-h-screen border p-1": showPopup,
          },
        )}
      >
        {canEdit && (
          <p
            onClick={() => {
              setShowPopup(false);
              setIsEditing(true);
            }}
            className="p-[1px] hover:bg-primary"
          >
            Edit
          </p>
        )}
        <span
          onClick={() => {
            if (
              window.confirm("are you sure that you want delete this post?")
            ) {
              deletePostOrCommentFunc();
            }
            setShowPopup(false);
          }}
          className="p-[1px] hover:bg-primary"
        >
          Delete
        </span>
      </div>
    </>
  );
};

export default Popup;
