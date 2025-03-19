"use client";

import Image from "next/image";
import Skill from "./skill";
import { Button } from "../ui/button";
import EnterIcon from "@/components/svgs/enter.svg";
import ArrowCornerIcon from "@/components/svgs/arrow-corner.svg";
import { useRouter } from "next/navigation";
import { IAuthor, Iuser } from "@/@types/user";

export interface SearchItemprops extends Iuser {
  onSelectUser?: (user: IAuthor) => void; // Новый пропс
}

const SearchItem: React.FC<SearchItemprops> = ({
  _id,
  first_name,
  second_name,
  img_url,
  description,
  skills,
  onSelectUser, // Деструктурируем новый пропс
}) => {
  const router = useRouter();
  return (
    <div className="flex h-[160px] w-full animate-fade-in items-center justify-between gap-x-[100px] border-2 px-6 py-10">
      <div className="flex items-center gap-x-5">
        <Image
          onClick={() => router.push(`/${_id}`)}
          width={71}
          height={71}
          className="h-[71px] w-[71px] cursor-pointer rounded-[50%] duration-200 hover:scale-105"
          src={img_url || "/avatar.png"}
          alt="avatar"
        />
        <div className="flex flex-col gap-y-1">
          <span
            onClick={() => router.push(`/${_id}`)}
            className="cursor-pointer text-[18px] font-extrabold"
          >
            {first_name} {second_name}
          </span>
        </div>
      </div>

      <p className="max-w-[340px] text-[12px] font-medium">
        {description
          ? description
          : "the user has not filled in the description field yet"}
      </p>

      <div className="flex min-w-[150px] flex-wrap gap-1">
        {skills.length > 0 ? (
          skills
            ?.slice(0, 8)
            .map((item: string, index: number) => (
              <Skill key={index} text={item} />
            ))
        ) : (
          <p className="text-[12px] font-medium">
            the user has not yet indicated what skills he has
          </p>
        )}
      </div>

      <div className="flex gap-x-[6px]">
        <Button
          className="whitespace-nowrap"
          onClick={() => {
            if (onSelectUser) {
              onSelectUser({
                _id,
                first_name,
                second_name,
                img_url,
              });
            }
          }}
        >
          Send message
          <EnterIcon />
        </Button>

        <Button
          onClick={() => {
            if (_id) {
              router.push(_id);
            }
          }}
          className="p-3"
        >
          <ArrowCornerIcon />
        </Button>
      </div>
    </div>
  );
};

export default SearchItem;
