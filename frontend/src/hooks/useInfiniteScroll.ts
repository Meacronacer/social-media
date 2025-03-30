import { useEffect } from "react";

export const useInfiniteScroll = (
  containerRef: React.RefObject<HTMLElement | null>,
  callback: () => void,
  isFetching: boolean,
  hasMore: boolean,
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 100 &&
        !isFetching &&
        hasMore
      ) {
        callback();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, callback, isFetching, hasMore]);
};
