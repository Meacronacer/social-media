import { useRef, useEffect, useCallback } from "react";
import {
  useGetPostsPaginatedQuery,
  useLazyGetPostsPaginatedQuery,
} from "@/api/postsApi";
import PostSkeleton from "../skeletons/postSkeleton";
import Post from "./postItem";
import { IPost } from "@/@types/post";

interface Props {
  userId: string;
  isOwnPage: boolean;
}

const PostsList: React.FC<Props> = ({ userId, isOwnPage }) => {
  const limit = 5;
  const containerRef = useRef<HTMLDivElement>(null);
  // Начальный запрос (без lastCreatedAt — сервер вернёт первую страницу)
  const { data, isFetching, isLoading } = useGetPostsPaginatedQuery(
    { userId, limit },
    { skip: !userId },
  );

  // Для подгрузки следующих страниц используем ленивый запрос
  const [trigger] = useLazyGetPostsPaginatedQuery();

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isFetching || !data?.hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 200) {
      // Берём дату создания последнего поста из объединённого кэша
      const lastPost = data.posts[data.posts.length - 1];
      if (lastPost) {
        trigger({ userId, limit, lastCreatedAt: lastPost.createdAt });
      }
    }
  }, [data, isFetching, trigger, userId, limit]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const containerHeight = isOwnPage
    ? "h-[calc(100dvh-320px)]"
    : "h-[calc(100dvh-230px)]";

  return (
    <div
      ref={containerRef}
      className={`flex ${containerHeight} flex-col gap-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit`}
    >
      {data?.posts.map((post: IPost) => <Post key={post._id} {...post} />)}

      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {!data?.hasMore && data?.posts && data?.posts?.length > 0 && (
        <p className="py-4 text-center text-gray-500">No more posts</p>
      )}

      {!data?.hasMore && data?.posts?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No posts found</p>
      )}
    </div>
  );
};

export default PostsList;
