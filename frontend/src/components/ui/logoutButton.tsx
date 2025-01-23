"use client";
import { useLoginMutation, useLogoutMutation } from "@/api/auth";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { LinkTo } from "@/utils/links";

const LogoutButton = () => {
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

  return (
    <Button onClick={logoutHandler} variant="danger" className="mt-10">
      Выйти
    </Button>
  );
};

export default LogoutButton;
