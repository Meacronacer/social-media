import ProfileSection from "@/components/shared/profileSection";

export const metadata = {
  title: "Profile",
  description: "Official Profile page of our website",
};

const ProfilePage = () => {
  return <ProfileSection isOwnPage={false} />;
};

export default ProfilePage;
