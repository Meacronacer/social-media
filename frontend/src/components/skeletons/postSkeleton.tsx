const PostSkeleton: React.FC = () => {
  return (
    <div className="relative flex w-full animate-pulse items-start gap-x-4 border-2 border-white p-5 pb-2">
      {/* Аватар */}
      <div className="h-8 w-8 rounded-full bg-gray-300" />
      <div className="w-full">
        {/* Заголовок (имя автора и дата) */}
        <div className="flex gap-x-2">
          <div className="h-4 w-1/3 rounded bg-gray-300" />
          <div className="h-4 w-1/5 rounded bg-gray-300" />
        </div>
        {/* Текст поста */}
        <div className="mt-1 space-y-2">
          <div className="h-3 w-full rounded bg-gray-300" />
          <div className="h-3 w-5/6 rounded bg-gray-300" />
          <div className="h-3 w-4/6 rounded bg-gray-300" />
        </div>
        {/* Блок с лайками и комментариями */}
        <div className="mt-4 flex gap-x-5">
          <div className="flex items-center gap-x-1">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <div className="h-4 w-6 rounded bg-gray-300" />
          </div>
          <div className="flex items-center gap-x-1">
            <div className="h-4 w-4 rounded-full bg-gray-300" />
            <div className="h-4 w-6 rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
