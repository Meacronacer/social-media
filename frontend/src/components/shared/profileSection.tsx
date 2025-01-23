"use client";
import { Button } from "@/components/ui/button";
import SettingsIcon from "@/components/svgs/settings.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import EnterIcon from "@/components/svgs/enter.svg";
import Post from "@/components/shared/post";
import PlusIcon from "@/components/svgs/plus.svg";
import Skill from "@/components/shared/skill";
import { useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { LinkTo } from "@/utils/links";

interface props {
  isOwnPage: boolean;
  userId: string;
}

const ProfileSection: React.FC<props> = ({ isOwnPage, userId }) => {
  const user = useAppSelector((state) => state.authSlice.user);
  const router = useRouter();
  return (
    <section className="w-[calc(screen_-_300px)] p-6">
      {/* top bar */}
      <section className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-6">
          <Image
            width={140}
            height={140}
            alt="avatar"
            className="rounded-[50%]"
            src={user?.img_url || "/avatar.png"}
          />
          <h1 className="text-[24px] font-extrabold">
            {user?.first_name} {user?.second_name}
          </h1>
        </div>
        <Button
          onClick={() => {
            if (isOwnPage) {
              router.push(LinkTo.settings);
            } else {
              router.push(LinkTo.chats);
            }
          }}
        >
          <span>{isOwnPage ? "Редактировать" : "Send message"}</span>
          {isOwnPage ? <SettingsIcon /> : <EnterIcon />}
        </Button>
      </section>

      <div className="mt-12 flex w-full gap-x-[64px]">
        {/* posts */}
        <section className="h-[calc(100vh_-_250px)] w-full max-w-[65%] overflow-y-auto pr-2 scrollbar-thin scrollbar-webkit">
          {/* write new post */}
          {isOwnPage && (
            <div className="mb-4 flex h-[76px] items-center gap-x-3 border-2 border-white bg-black p-[16px]">
              <img
                src={user?.img_url || "/avatar.png"}
                className="h-8 w-8 rounded-[50%]"
                alt="avatar"
              />
              <Input
                containerClassName="w-full"
                placeholder="Напишите что-нибудь"
              />
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center duration-300 hover:bg-active">
                <Image width={16} height={16} src="/smile.svg" alt="icons" />
              </div>
              <Button className="w-[44px] justify-center p-[14px]">
                <EnterIcon />
              </Button>
            </div>
          )}

          {/* list of posts */}
          <div className="flex flex-col gap-y-4">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </section>

        {/* subs */}
        <section className="w-[30%]">
          <div className="flex items-center justify-between gap-x-3">
            <span className="text-[18px] font-extrabold">Подписчики</span>
            <div>28</div>
          </div>
          <div className="mt-4 flex items-center gap-x-[6px]">
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <Image width={36} height={36} src="/avatar.png" alt="sub" />
            <div className="flex cursor-pointer items-center justify-center p-1 duration-200 hover:scale-125">
              <PlusIcon />
            </div>
          </div>

          {/* skills */}

          <span className="mt-8 block text-[18px] font-extrabold">Навыки</span>

          <div className="mt-4 flex gap-1">
            <Skill text="JS" />
            <Skill text="CSS" />
            <Skill text="HTML" />
            <Skill text="ANGULAR" />
            <Skill text="FRONTEND" />
          </div>

          {/* about yourself */}

          <span className="mt-8 block text-[18px] font-extrabold">О себе</span>

          <p className="mt-4 text-[12px] font-medium">
            Список навыков, который мы обсудили выше, — основа резюме,
            но не единственная его часть. Также можно рассказать о себе
            в классическом смысле — этот раздел можно добавить
            в сопроводительное письмо.
          </p>
        </section>
      </div>
    </section>
  );
};

export default ProfileSection;
