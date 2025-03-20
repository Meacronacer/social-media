import ProfileClientPage from "@/components/client/profileClient";

export const metadata = {
  title: "Profile",
  description: "Official Profile page of our website",
};

const ProfilePage: React.FC = async () => {
  return <ProfileClientPage isOwnPage={true} />;
};

export default ProfilePage;
