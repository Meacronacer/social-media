import Skill from "@/components/shared/skill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const SettingsPage = () => {
  return (
    <section className="flex gap-x-10 p-6 pl-12">
      <div className="w-[31%]">
        <div className="flex items-center gap-x-6">
          <Image src="/avatar.png" width={112} height={112} alt="avatar" />
          <div className="flex flex-col gap-y-1">
            <span className="text-[24px] font-extrabold">Райан Гослинг</span>
            <span className="text-[14px] text-white/50">ryan.gosling</span>
          </div>
        </div>

        <div className="mt-8 w-full border-b border-dashed border-white"></div>

        <div>
          <span className="mt-8 block text-[18px] font-extrabold">Навыки</span>

          <div className="mt-3 flex gap-1">
            <Skill text="JS" />
            <Skill text="CSS" />
            <Skill text="HTML" />
            <Skill text="ANGULAR" />
            <Skill text="FRONTEND" />
          </div>

          {/* about yourself */}

          <span className="mt-8 block text-[18px] font-extrabold">О себе</span>

          <p className="mt-3 text-[12px] font-medium">
            Список навыков, который мы обсудили выше, — основа резюме,
            но не единственная его часть. Также можно рассказать о себе
            в классическом смысле — этот раздел можно добавить
            в сопроводительное письмо.
          </p>
        </div>
      </div>

      <form className="flex max-h-[calc(100vh-48px)] w-[65%] border p-8 pr-2">
        <div className="flex w-full flex-col gap-y-5 overflow-y-auto pr-4 scrollbar-thin scrollbar-webkit">
          <div className="flex items-center gap-x-5">
            <div className="flex w-full flex-col gap-y-[2px]">
              <label className="text-light-transparent text-[12px]">Имя</label>
              <Input variant="second" placeholder="enter the data..." />
            </div>
            <div className="flex w-full flex-col gap-y-[2px]">
              <label className="text-light-transparent text-[12px]">
                Фамилия
              </label>
              <Input variant="second" placeholder="enter the data..." />
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-[2px]">
            <label className="text-light-transparent text-[12px]">
              Telegram username
            </label>
            <Input variant="second" placeholder="enter the data..." />
          </div>

          <div className="flex w-full flex-col gap-y-[2px]">
            <label className="text-light-transparent text-[12px]">О себе</label>
            <textarea
              className="h-[108px] resize-none border-b-[1px] bg-black py-3 text-[12px] scrollbar-thin scrollbar-webkit focus:outline-none"
              placeholder="enter the data..."
            ></textarea>
          </div>

          <div className="border-light-solid mt-5 flex gap-x-8 border-b-[1px] pb-4">
            <div className="relative w-[20%]">
              <label className="absolute -top-7 text-[12px] text-white/50">
                Аватарка
              </label>
              <Image width={140} height={140} alt="avatar" src="/avatar.png" />
            </div>
            <div className="flex h-[140px] w-[80%] flex-col border border-dashed">
              <input className="hidden" type="file" />
              <svg className="mx-auto mt-4 h-[18px] w-[18px] text-white"></svg>
              <p className="mt-4 text-center text-[14px]">
                Перетащите изображение или
                <a className="ml-2 cursor-pointer text-primary underline">
                  Загрузите
                </a>
                <br />
                (разрешение до 5,000 x 5,000 px)
              </p>
            </div>
          </div>

          <div className="relative flex w-full flex-col gap-y-[2px]">
            <label className="text-light-transparent text-[12px]">Навыки</label>
            <Input variant="second" placeholder="enter the data..." />
          </div>

          <div className="mt-[100px] flex items-center justify-between">
            <div className="flex items-center gap-x-5">
              <div className="hover:bg-dark-active cursor-pointer rounded-[2px] border-[1px] p-[14px]"></div>
              <div className="hover:bg-dark-active cursor-pointer rounded-[2px] border-[1px] p-[14px]"></div>
            </div>
            <div className="flex items-center gap-x-5">
              <Button>Отмена</Button>
              <Button>Сохранить</Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SettingsPage;
