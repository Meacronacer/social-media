import { formatMessageTimestamp } from "@/utils/formatMessageTimeStamp";
import Image from "next/image";
import LikeIcon from "@/components/svgs/like.svg";
import {
  useDeleteCommentMutation,
  useEditCommentMutation,
  useLikeCommentMutation,
} from "@/api/commentApi";
import { cn } from "@/utils/twMerge";
import Popup from "./popup";
import { useState } from "react";
import EditText from "./editText";
import { IComment } from "@/@types/comment";
import { useRouter } from "next/navigation";

interface props {
  userId: string | undefined;
  postAuthorId?: string;
  comment: IComment;
}

const Comment: React.FC<props> = ({ userId, postAuthorId, comment }) => {
  const router = useRouter();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [editComment, { isLoading }] = useEditCommentMutation();
  const commentIsLikedByUser = comment.likes.includes(userId || "");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const likeCommentHandler = () => {
    likeComment({ commentId: comment._id, postId: comment.post })
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const deleteCommentHandler = () => {
    deleteComment({ commentId: comment._id, postId: comment.post })
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const editCommentHandler = (editedText: string) => {
    editComment({
      commentId: comment._id,
      text: editedText,
      postId: comment.post, // Убедитесь, что comment содержит postId
    })
      .unwrap()
      .then(() => setIsEditing(false))
      .catch((err) => console.log(err));
  };

  // Логика: редактировать может только автор комментария,
  // удалять могут автор комментария или автор поста.
  const canEdit = userId === comment.author?._id;
  const canDelete = canEdit || userId === postAuthorId;

  return (
    <div className="relative flex items-start gap-x-4">
      <Image
        onClick={() => {
          if (!canEdit) {
            router.push(`/${comment.author._id}`);
          }
        }}
        width={32}
        height={32}
        className={cn("rounded-[50%]", {
          "cursor-default": true,
          "cursor-pointer": !canEdit,
        })}
        src={comment.author?.img_url || "/avatar.png"}
        alt="avatar"
      />
      <div className="w-full">
        <div className="flex items-center justify-between gap-x-3">
          <span
            onClick={() => {
              if (!canEdit) {
                router.push(`/${comment.author._id}`);
              }
            }}
            className={cn("text-[12px] font-medium", {
              "cursor-default": true,
              "cursor-pointer": !canEdit,
            })}
          >
            {comment.author?.first_name} {comment.author?.second_name}
          </span>
          <div className={cn("mr-6 flex items-center")}>
            <span className="text-[12px] font-medium text-white/50">
              {formatMessageTimestamp(comment.createdAt)}
            </span>
            {canDelete && (
              <div className="absolute right-0 cursor-pointer">
                <Popup
                  setIsEditing={setIsEditing}
                  canEdit={canEdit}
                  deletePostOrCommentFunc={deleteCommentHandler}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-x-5">
          {isEditing ? (
            <EditText
              isLoading={isLoading}
              text={comment.text}
              submitEditTextFunc={editCommentHandler}
              setIsEditing={setIsEditing}
            />
          ) : (
            <p className="mt-2 text-[12px]">{comment.text}</p>
          )}

          <div className="mt-3 flex gap-x-1">
            <LikeIcon
              onClick={likeCommentHandler}
              className={cn("cursor-pointer text-white", {
                "text-white": true,
                "text-primary": commentIsLikedByUser,
              })}
            />
            {comment.likes.length > 0 && (
              <p
                className={cn("text-[12px]", {
                  "text-white": true,
                  "text-primary": commentIsLikedByUser,
                })}
              >
                {comment.likes.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
