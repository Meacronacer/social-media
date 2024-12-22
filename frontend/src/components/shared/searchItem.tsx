import Image from "next/image";
import Skill from "./skill";
import { Button } from "../ui/button";
import EnterIcon from "@/components/svgs/enter.svg";
import ArrowCornerIcon from "@/components/svgs/arrow-corner.svg";

const SearchItem = () => {
  return (
    <div className="flex h-[160px] w-full items-center justify-between gap-x-[100px] border-2 px-6 py-10">
      <div className="flex items-center gap-x-5">
        <Image width={71} height={71} src="/avatar.png" alt="avatar" />
        <div className="flex flex-col gap-y-1">
          <span className="text-[18px] font-extrabold">Райан Гослинг</span>
          <span className="text-[14px] text-white/50">ryan.gosling</span>
        </div>
      </div>

      <p className="text-[12px] font-medium">
        Список навыков, который мы обсудили выше, — основа резюме,
        но не единственная его часть. Также можно рассказать о себе
        в классическом смысле — этот раздел можно добавить в сопроводительное
        письмо.
      </p>

      <div className="flex min-w-[150px] flex-wrap gap-1">
        <Skill text="JS" />
        <Skill text="CSS" />
        <Skill text="HTML" />
        <Skill text="ANGULAR" />
        <Skill text="FRONTEND" />
      </div>

      <div className="flex gap-x-[6px]">
        <Button>
          Написать
          <EnterIcon />
        </Button>

        <Button className="p-3">
          <ArrowCornerIcon />
        </Button>
      </div>
    </div>
  );
};

export default SearchItem;
