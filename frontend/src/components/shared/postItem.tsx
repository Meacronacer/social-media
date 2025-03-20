"use client";
import Image from "next/image";
import CommentIcon from "@/components/svgs/comments.svg";
import LikeIcon from "@/components/svgs/like.svg";
import Comment from "./comment";
import EditIcon from "@/components/svgs/post-edit.svg";
import { memo, useRef, useState } from "react";
import { cn } from "@/utils/twMerge";
import { useClickOutside } from "@/hooks/useClickOutside";
import CreatePostForm from "../forms/PostOrCommentForm";
import { formatMessageTimestamp } from "@/utils/formatMessageTimeStamp";
import {
  useDeletePostMutation,
  useEditPostMutation,
  useGetPostsPaginatedQuery,
  useLikePostMutation,
} from "@/api/posts";
import { useAppSelector } from "@/hooks/useRedux";
import Popup from "./popup";
import EditText from "./editText";
import { IPost } from "@/@types/post";

const Post: React.FC<IPost> = memo(
  ({ _id, author, text, comments, likes, createdAt }) => {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const userId = useAppSelector((state) => state.authSlice.user._id);
    const postIsLikedByUser = likes.includes(userId);

    const [likePost] = useLikePostMutation();
    const [deletePost] = useDeletePostMutation();
    const [editPost, { isLoading }] = useEditPostMutation();

    const likePostHandler = () => {
      likePost(_id)
        .unwrap()
        .catch((err) => console.log(err));
    };

    const deletePostHandler = () => {
      deletePost(_id)
        .unwrap()
        .catch((err) => console.log(err));
    };

    const editPostHandler = (editedText: string) => {
      editPost({ postId: _id, text: editedText })
        .unwrap()
        .then(() => {
          setIsEditing(false);
        })
        .catch((err) => console.log(err));
    };

    return (
      <div className="relative flex w-full animate-fade-in items-start gap-x-4 border-2 border-white p-5 pb-2">
        {userId === author?._id && !isEditing && (
          <div className="absolute right-5 cursor-pointer">
            <Popup
              canEdit={true}
              setIsEditing={setIsEditing}
              deletePostOrCommentFunc={deletePostHandler}
            />
          </div>
        )}
        <Image
          src={author?.img_url || "/avatar.png"}
          width={32}
          height={32}
          className="h-8 w-8 rounded-[50%]"
          alt="avatar"
        />
        <div className="w-full">
          <div className="flex gap-x-2">
            <span className="text-[14px] font-bold">
              {author?.first_name} {author?.second_name}
            </span>
            <span className="text-[14px] font-medium text-white/50">
              {formatMessageTimestamp(createdAt)}
            </span>
          </div>
          {isEditing ? (
            <EditText
              isLoading={isLoading}
              text={text}
              submitEditTextFunc={editPostHandler}
              setIsEditing={setIsEditing}
            />
          ) : (
            <p className="mt-1 text-[12px] font-medium leading-[133%]">
              {text}
            </p>
          )}

          {/* count of comments and likes */}
          <div className="mt-4 flex gap-x-5 text-white">
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
              <span className="text-[12px] font-bold">
                {comments.length > 0 && comments.length}
              </span>
            </div>
            <div
              onClick={likePostHandler}
              className="mt-[6px] flex h-1 cursor-pointer items-center gap-x-1"
            >
              <LikeIcon
                className={postIsLikedByUser ? "text-primary" : "text-white"}
              />
              <span
                className={cn("text-[12px] font-bold", {
                  "text-white": true,
                  "text-primary": postIsLikedByUser,
                })}
              >
                {likes.length > 0 && likes.length}
              </span>
            </div>
          </div>

          {/* comments */}

          <div
            className={cn(
              "flex h-full flex-col gap-y-5 overflow-y-auto pr-5 duration-500 scrollbar-thin scrollbar-webkit",
              {
                "max-h-0": true,
                "mt-5 max-h-[300px] pb-2": showComments,
              },
            )}
          >
            {comments.length > 0 ? (
              comments.map((comment) => {
                return (
                  <Comment
                    userId={userId}
                    postAuthorId={author._id}
                    key={comment._id}
                    comment={comment}
                  />
                );
              })
            ) : (
              <p className="p-2 text-center font-medium text-gray-500">
                No comments.
              </p>
            )}
          </div>

          <div
            className={cn("mt-4 overflow-hidden pt-2", {
              "max-h-0": true,
              "mt-5 max-h-[300px]": showComments,
            })}
          >
            <CreatePostForm
              postId={_id}
              isComment={true}
              border="border border-dashed"
            />
          </div>
        </div>
      </div>
    );
  },
);

export default Post;
