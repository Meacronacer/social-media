"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/svgs/search.svg";
import SearchItem from "@/components/shared/searchItem";
import { useGetAllUsersQuery } from "@/api/user";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setNewUser } from "@/redux/slices/chatSlice";
import SearchItemSkeleton from "../skeletons/searchItemSkeleton";
import { IAuthor, Iuser } from "@/@types/user";

const SearchClientPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLocalLoading(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsLocalLoading(false);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchTerm]);

  const { data = [], isLoading } = useGetAllUsersQuery(debouncedSearchTerm);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSelectUser = (user: IAuthor) => {
    dispatch(setNewUser(user));
    router.push(`/chats`);
  };

  const showLoading = isLoading || isLocalLoading;

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

      <div className="mt-5 flex h-[calc(100vh_-_140px)] flex-col overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit">
        {showLoading ? (
          <div className="flex animate-fade-in flex-col gap-y-2">
            {[1, 2].map((i) => (
              <SearchItemSkeleton
                key={i}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="flex animate-fade-in flex-col gap-y-2">
            {data?.map((user: Iuser, index: number) => (
              <div
                key={user._id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <SearchItem {...user} onSelectUser={handleSelectUser} />
              </div>
            ))}
            {debouncedSearchTerm && data?.length === 0 && (
              <p className="animate-fade-in text-[20px]">
                No users were found matching your request...
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchClientPage;
