"use client";
import ProfileSection from "@/components/shared/profileSection";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const { userId } = useParams(); // Получаем объект router

  const userIdString = Array.isArray(userId) ? userId[0] : userId || "";

  return <ProfileSection isOwnPage={false} userId={userIdString} />;
};

export default ProfilePage;
