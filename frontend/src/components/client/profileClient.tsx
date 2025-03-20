"use client";
import ProfileSection from "@/components/shared/profileSection";
import { useAppSelector } from "@/hooks/useRedux";
import { LinkTo } from "@/utils/links";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface props {
  isOwnPage: boolean;
}

const ProfileClientPage: React.FC<props> = ({ isOwnPage }) => {
  const { _id, img_url } = useAppSelector((state) => state.authSlice.user);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // Проверяем, если текущий _id пользователь совпадает с параметром пути
    if (_id === path.slice(1)) {
      router.push(LinkTo.home);
    }
  }, [_id, path, router]);

  return <ProfileSection isOwnPage={isOwnPage} currentUserImg={img_url} />;
};

export default ProfileClientPage;
