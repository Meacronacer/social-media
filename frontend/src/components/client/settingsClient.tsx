"use client";
import SettingsForm from "@/components/forms/settingsForm";
import Skill from "@/components/shared/skill";
import { useAppSelector } from "@/hooks/useRedux";
import Image from "next/image";
import { Button } from "../ui/button";
import { useLogoutMutation } from "@/api/auth";
import { useRouter } from "next/navigation";
import { LinkTo } from "@/utils/links";
import Switch from "../ui/switch";
import { SettingsClientPageSkeleton } from "../skeletons/settingsSkeleton";

const SettingsClientPage = () => {
  const { first_name, second_name, img_url, description, skills } =
    useAppSelector((state) => state.authSlice.user);

  const [logout] = useLogoutMutation({});
  const router = useRouter();

  const logoutHandler = () => {
    if (window.confirm("are you sure that you want logout?")) {
      logout({})
        .unwrap()
        .then(() => {
          router.push(LinkTo.login);
        });
    }
  };

  if (!first_name) return <SettingsClientPageSkeleton />;

  return (
    <section className="flex gap-x-10 bg-black p-6 pl-12">
      <div className="w-[31%]">
        <div className="flex items-center gap-x-6">
          <Image
            src={img_url || "/avatar.png"}
            className="h-[112px] w-[112px] rounded-full"
            width={112}
            height={112}
            alt="avatar"
          />
          <div className="flex flex-col gap-y-1">
            <span className="text-[24px] font-extrabold">
              {first_name} {second_name}
            </span>
          </div>
        </div>

        <div className="mb-6 mt-8 w-full border-b border-dashed border-white"></div>

        <div className="flex justify-between gap-x-3">
          {" "}
          <p>Hide Notification Messages</p>
          <Switch />
        </div>

        <div>
          <span className="mt-4 block text-[18px] font-extrabold">Skills</span>

          <div className="mt-3 flex gap-1">
            {skills?.length > 0 ? (
              skills?.map((text: string, idx: number) => (
                <Skill key={idx} text={text} />
              ))
            ) : (
              <p className="text-[14px] text-red-300">
                you haven't added any skills yet, please add them
              </p>
            )}
          </div>

          {/* about yourself */}

          <span className="mt-8 block text-[18px] font-extrabold">
            About myself
          </span>

          {description ? (
            <p className="mt-3 text-[12px] font-medium">{description}</p>
          ) : (
            <p className="mt-3 text-[12px] text-red-300">
              Please tell us about yourself so that other users can understand
              in more detail what you like and what you can do
            </p>
          )}

          <Button onClick={logoutHandler} variant="danger" className="mt-10">
            Logout
          </Button>
        </div>
      </div>

      <SettingsForm
        first_name={first_name}
        second_name={second_name}
        description={description}
        img_url={img_url}
        skills={skills}
      />
    </section>
  );
};

export default SettingsClientPage;
