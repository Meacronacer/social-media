import { useRef, useEffect, useState, useCallback } from "react";
import { useGetPostsPaginatedQuery } from "@/api/posts";
import PostSkeleton from "../skeletons/postSkeleton";
import Post from "./postItem";
import { IPost } from "@/@types/post";

const PostsList = ({ userId }: { userId: string }) => {
  const [accumulatedPosts, setAccumulatedPosts] = useState<IPost[]>([]);
  const [lastCreatedAt, setLastCreatedAt] = useState<string>();
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const { data: response, isFetching } = useGetPostsPaginatedQuery(
    { userId, limit, lastCreatedAt },
    { skip: !userId || !hasMore },
  );

  // Обработка новых данных
  useEffect(() => {
    if (response) {
      loadingRef.current = false;
      setAccumulatedPosts((prev) => {
        const newPosts = response.posts.filter(
          (post) => !prev.some((p) => p._id === post._id),
        );
        return [...prev, ...newPosts];
      });
      setHasMore(response.hasMore);
    }
  }, [response]);

  // Проверка необходимости подгрузки
  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loadingRef.current || !hasMore) return;

    const hasScroll = container.scrollHeight > container.clientHeight;
    console.log("Scroll check:", {
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
      hasScroll,
    });

    if (!hasScroll && accumulatedPosts.length > 0) {
      console.log("No scroll - loading more");
      loadingRef.current = true;
      const lastPost = accumulatedPosts[accumulatedPosts.length - 1];
      setLastCreatedAt(lastPost.createdAt);
    }
  }, [hasMore, accumulatedPosts]);

  // Автопроверка после каждого обновления постов
  useEffect(() => {
    const timer = setTimeout(checkScroll, 100); // Даем время на рендер
    return () => clearTimeout(timer);
  }, [accumulatedPosts, checkScroll]);

  // Обработчик скролла
  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 300;

    if (isNearBottom) {
      console.log("Scrolled to bottom - loading more");
      loadingRef.current = true;
      const lastPost = accumulatedPosts[accumulatedPosts.length - 1];
      setLastCreatedAt(lastPost?.createdAt);
    }
  }, [hasMore, accumulatedPosts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", loadMore);
    return () => container.removeEventListener("scroll", loadMore);
  }, [loadMore]);

  // Первичная загрузка
  useEffect(() => {
    if (accumulatedPosts.length === 0 && !isFetching) {
      checkScroll();
    }
  }, [accumulatedPosts, isFetching]);

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100dvh-350px)] flex-col gap-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit"
    >
      {accumulatedPosts.map((post) => (
        <Post key={post._id} {...post} />
      ))}

      {isFetching && <PostSkeleton />}

      {!hasMore && accumulatedPosts.length > 0 && (
        <p className="py-4 text-center text-gray-500">No more posts</p>
      )}

      {!hasMore && accumulatedPosts.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No posts found</p>
      )}
    </div>
  );
};

export default PostsList;
