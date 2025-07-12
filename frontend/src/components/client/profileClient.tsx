"use client";
import ProfileSection from "@/components/shared/profileSection";
import { useAppSelector } from "@/hooks/useRedux";
import { selectGetMeResult } from "@/redux/selectors/userSelector";
import { LinkTo } from "@/utils/links";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface props {
  isOwnPage: boolean;
}

const ProfileClientPage: React.FC<props> = ({ isOwnPage }) => {
  const userId = useAppSelector(selectGetMeResult)?.data?._id;
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // Проверяем, если текущий _id пользователь совпадает с параметром пути
    if (userId === path.slice(1)) {
      router.push(LinkTo.home);
    }
  }, [userId, path, router]);

  return <ProfileSection isOwnPage={isOwnPage} />;
};

export default ProfileClientPage;
