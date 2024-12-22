"use client";

import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/svgs/search.svg";
import SearchItem from "@/components/shared/searchItem";

const SearchPage = () => {
  return (
    <section className="p-6">
      <div className="flex h-[78px] items-center justify-center border bg-black px-5 py-[14px]">
        <div className="relative w-full">
          <Input placeholder="Enter username" variant="second" />
          <SearchIcon className="absolute right-1 top-3" />
        </div>
      </div>

      {/* search results */}
      <div className="mt-5 flex flex-col gap-y-2">
        <SearchItem />
        <SearchItem />
      </div>
    </section>
  );
};

export default SearchPage;
