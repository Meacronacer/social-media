"use client";
import { useEffect, useRef, useState } from "react";
import { useGetAllUsersQuery } from "@/api/userApi";
import { useDebounce } from "@/hooks/useDebounce"; // Добавьте throttle хук
import SearchItem from "../shared/searchItem";
import SearchItemSkeleton from "../skeletons/searchItemSkeleton";
import { Input } from "../ui/input";
import SearchIcon from "@/components/svgs/search.svg";
import { useThrottle } from "@/hooks/useThrottle";

const SCROLL_THRESHOLD = 500;
const PAGE_LIMIT = 10;

const SearchClientPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);
  const { debouncedValue, isDebouncing: isLocalLoading } = useDebounce(
    searchTerm,
    1000,
  );

  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    search: debouncedValue,
    page,
    limit: PAGE_LIMIT,
  });

  // Сбрасываем страницу при изменении поиска
  useEffect(() => setPage(1), [debouncedValue]);

  // Оптимизированный обработчик скролла
  const handleScroll = useThrottle(() => {
    const container = containerRef.current;
    if (!container || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const currentPosition = scrollHeight - (scrollTop + clientHeight);

    if (currentPosition < SCROLL_THRESHOLD && data?.hasMore) {
      scrollPosition.current = scrollTop;
      setPage((prev) => prev + 1);
    }
  }, 200);

  // Восстановление позиции скролла после загрузки
  useEffect(() => {
    if (!isFetching && containerRef.current) {
      containerRef.current.scrollTop = scrollPosition.current;
    }
  }, [isFetching]);

  const showLoader = isLocalLoading || isLoading;

  return (
    <section className="p-6">
      <div className="flex h-[78px] items-center justify-center border bg-black px-5 py-[14px]">
        <div className="relative w-full">
          <Input
            placeholder="Find the desired user by name and skills..."
            variant="second"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm ? (
            <div
              title="press to clear search input"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1 cursor-pointer text-[20px] duration-300 hover:scale-125"
            >
              x
            </div>
          ) : (
            <SearchIcon className="absolute right-1 top-3" />
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="mt-5 h-[calc(100vh_-_140px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit"
        onScroll={handleScroll}
      >
        {/* Основной контент */}
        <div className="flex flex-col gap-y-2">
          {data?.users?.map((user) => <SearchItem key={user._id} {...user} />)}
        </div>

        {/* Индикатор загрузки */}
        {showLoader && page === 1 && (
          <div className="mt-4 flex flex-col gap-y-2">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <SearchItemSkeleton
                  key={i}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
          </div>
        )}

        {/* Пустой результат */}
        {!isFetching && data?.users?.length === 0 && (
          <p className="text-center text-xl">No users found...</p>
        )}
      </div>
    </section>
  );
};

export default SearchClientPage;
