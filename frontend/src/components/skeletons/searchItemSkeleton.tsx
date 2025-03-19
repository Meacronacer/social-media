import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {};

const SearchItemSkeleton: React.FC<Props> = ({ style, className }) => {
  return (
    <div
      style={style}
      className={`flex h-[160px] w-full animate-pulse items-center justify-between gap-x-[100px] border-2 px-6 py-10 ${className}`}
    >
      {/* Скелетон аватара */}
      <div className="flex items-center gap-x-5">
        <div className="h-[71px] w-[71px] rounded-full bg-gray-300" />
        <div className="flex flex-col gap-y-1">
          <div className="h-4 w-32 rounded bg-gray-300" />
        </div>
      </div>

      {/* Скелетон описания */}
      <div className="h-10 w-96 rounded bg-gray-300" />

      {/* Скелетон навыков */}
      <div className="flex min-w-[150px] flex-wrap gap-1">
        <div className="h-6 w-12 rounded bg-gray-300" />
        <div className="h-6 w-16 rounded bg-gray-300" />
        <div className="h-6 w-14 rounded bg-gray-300" />
        <div className="h-6 w-20 rounded bg-gray-300" />
        <div className="h-6 w-24 rounded bg-gray-300" />
      </div>

      {/* Скелетон кнопок */}
      <div className="flex gap-x-[6px]">
        <div className="h-10 w-24 rounded bg-gray-300" />
        <div className="h-10 w-10 rounded bg-gray-300" />
      </div>
    </div>
  );
};

export default SearchItemSkeleton;
