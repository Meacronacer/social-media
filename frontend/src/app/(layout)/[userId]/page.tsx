import ProfileClientPage from "@/components/client/profileClient";

export const metadata = {
  title: "Profile",
  description: "Official Profile page of our website",
};

const ProfilePage = () => {
  return <ProfileClientPage isOwnPage={false} />;
};

export default ProfilePage;
