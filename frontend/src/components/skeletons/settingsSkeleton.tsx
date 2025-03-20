export const SettingsClientPageSkeleton = () => {
  return (
    <section className="flex gap-x-10 p-6 pl-12">
      {/* Левая колонка */}
      <div className="w-[31%]">
        <div className="flex items-center gap-x-6">
          <div className="h-[112px] w-[112px] animate-pulse rounded-full bg-gray-200"></div>
          <div className="flex flex-col gap-y-1">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="mb-6 mt-8 w-full border-b border-dashed border-gray-200"></div>

        <div className="flex items-center justify-between gap-x-3">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200"></div>
        </div>

        <div className="mt-6">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="mt-3 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 animate-pulse rounded-full bg-gray-200"
              ></div>
            ))}
          </div>

          <div className="mt-6">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-3/5 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          <div className="mt-10 h-10 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Правая колонка - Форма */}
      <div className="w-[65%] border bg-black p-8 pr-2">
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center gap-x-5">
            <div className="w-full space-y-2">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="w-full space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-28 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="border-b-[1px] border-gray-200 pb-4">
            <div className="flex gap-x-8">
              <div className="w-[20%]">
                <div className="h-[140px] w-[140px] animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="h-[140px] w-[80%] animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          <div className="h-16 animate-pulse rounded bg-gray-200"></div>

          <div className="mt-10 flex justify-between">
            <div className="flex gap-x-5">
              <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
