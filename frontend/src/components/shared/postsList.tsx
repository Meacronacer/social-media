import React, { useRef, useEffect, useCallback, useState } from "react";
import { useGetPostsPaginatedQuery } from "@/api/posts";
import PostSkeleton from "../skeletons/postSkeleton";
import Post from "./postItem";

interface props {
  userId: string | undefined;
  isOwnPage: boolean;
}

const PostsList: React.FC<props> = ({ userId, isOwnPage }) => {
  const limit = 8;
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastCreatedAt, setLastCreatedAt] = useState<string>();
  const [trigger, setTrigger] = useState(false);
  const loadingRef = useRef(false);

  const heightContainer = isOwnPage
    ? "h-[calc(100dvh-330px)] "
    : "h-[calc(100dvh-230px)] ";

  const { data, isFetching, isLoading, currentData } =
    useGetPostsPaginatedQuery(
      { userId: userId || "", limit, lastCreatedAt },
      { skip: !userId || !trigger },
    );

  const posts = currentData?.posts || [];
  const hasMore = currentData?.hasMore ?? false;

  // Инициализация первой загрузки
  useEffect(() => {
    if (userId && !lastCreatedAt) {
      setLastCreatedAt(new Date().toISOString());
      setTrigger(true);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore || loadingRef.current) return;

    const container = containerRef.current;
    if (!container || posts.length === 0) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 300;

    if (isNearBottom) {
      loadingRef.current = true;
      const lastPost = posts[posts.length - 1];
      setLastCreatedAt(lastPost.createdAt);
    }
  }, [isFetching, hasMore, posts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const debouncedScroll = debounce(loadMore, 100);
    container.addEventListener("scroll", debouncedScroll);
    return () => container.removeEventListener("scroll", debouncedScroll);
  }, [loadMore]);

  useEffect(() => {
    if (data) loadingRef.current = false;
  }, [data]);

  return (
    <div
      ref={containerRef}
      className={`flex ${heightContainer} flex-col gap-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit`}
    >
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}

      {isLoading && <PostSkeleton />}

      {!hasMore && posts.length > 0 && (
        <p className="py-4 text-center text-gray-500">No more posts</p>
      )}

      {!hasMore && posts.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No posts found</p>
      )}
    </div>
  );
};

// Дебаунс функция
const debounce = (func: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
};

export default PostsList;
