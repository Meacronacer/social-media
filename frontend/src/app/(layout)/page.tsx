import ProfileSection from "@/components/shared/profileSection";

export const metadata = {
  title: "Profile",
  description: "Official Profile page of our website",
};

const ProfilePage: React.FC = async () => {
  return <ProfileSection isOwnPage={true} />;
};

export default ProfilePage;
