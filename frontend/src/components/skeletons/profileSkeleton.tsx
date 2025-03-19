const ProfileSkeleton = () => {
  return (
    <div className="flex animate-pulse items-center gap-x-6">
      {/* Круглая заглушка для аватара */}
      <div className="h-[140px] w-[140px] rounded-full bg-gray-300" />

      <div className="flex flex-1 flex-col gap-y-2">
        {/* Заглушка для имени */}
        <div className="h-8 w-1/2 rounded bg-gray-300" />

        <div className="flex items-center gap-x-5">
          {/* Заглушка для количества постов */}
          <div className="h-6 w-16 rounded bg-gray-300" />
          <span>|</span>
          {/* Заглушка для подписчиков */}
          <div className="h-6 w-20 rounded bg-gray-300" />
          <span>|</span>
          {/* Заглушка для подписок */}
          <div className="h-6 w-20 rounded bg-gray-300" />
          {/* Заглушка для кнопки Subscribe */}
          <div className="ml-auto h-8 w-24 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
