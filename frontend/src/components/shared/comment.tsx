import Image from "next/image";

const Comment = () => {
  return (
    <div className="flex items-start gap-x-4">
      <Image width={32} height={32} src="/avatar.png" alt="avatar" />
      <div className="w-full">
        <div className="flex items-center justify-between gap-x-3">
          <span className="text-[12px] font-medium">Сара Коннор</span>
          <span className="text-[12px] font-medium text-white/50">
            04.04.2024
          </span>
        </div>
        <p className="mt-2 text-[12px]">
          Терминаторы тестирую стенд, Готему нужен герой. За ангуляр только ты
          шаришь, хелп!
        </p>
      </div>
    </div>
  );
};

export default Comment;
