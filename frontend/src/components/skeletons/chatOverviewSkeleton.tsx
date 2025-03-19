import React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  // Дополнительные пропсы компонента, если есть
};

const ChatOverviewSkeleton: React.FC<SkeletonProps> = ({
  style,
  className,
}) => {
  return (
    <div
      style={style}
      className={`flex h-[128px] w-[380px] animate-pulse items-start gap-x-4 border-b px-5 py-6 ${className}`}
    >
      {/* Скелетон для аватара */}
      <div className="h-8 w-8 rounded-full bg-gray-300" />

      <div className="flex w-full flex-col gap-y-2">
        <div className="flex justify-between">
          {/* Скелетон для имени */}
          <div className="h-3 w-24 rounded bg-gray-300" />
          {/* Скелетон для временной метки */}
          <div className="h-3 w-16 rounded bg-gray-300" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {/* Скелетон для последнего сообщения */}
          <div className="h-10 w-full rounded bg-gray-300" />
          {/* Скелетон для счетчика непрочитанных */}
          <div className="ml-2 h-6 w-6 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default ChatOverviewSkeleton;
