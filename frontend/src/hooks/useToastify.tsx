"use client";
import { Iuser } from "@/@types/user";
import { LinkTo } from "@/utils/links";
import { useRouter } from "next/compat/router";
import Image from "next/image";
import { ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserActions } from "./useUserActions";

export interface Sender {
  id: string;
  name: string;
  avatarUrl?: string;
}

const useToastify = () => {
  const router = useRouter();
  const { handleSelectUser } = useUserActions();

  const options: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark",
  };

  const toastSuccess = (message: string, autoClose: number = 5000) => {
    toast.success(message, { ...options, autoClose });
  };

  const toastError = (message: string) => {
    toast.error(message, options);
  };

  const toastInfo = (message: string) => {
    toast.info(message, { ...options, autoClose: 15000 });
  };

  const toastNewMessage = (sender: Iuser, message: string) => {
    // Можно использовать кастомное содержимое уведомления
    toast.info(
      <div
        onClick={() => handleSelectUser(sender)}
        className="flex cursor-pointer items-start gap-x-2"
      >
        <Image
          src={sender.img_url || "/avatar.png"}
          width={20}
          height={20}
          className="h-5 w-5 rounded-full"
          alt="user"
        />
        <div className="flex flex-col gap-y-1">
          <strong className="text-[14px]">
            New message: from {sender.first_name} {sender.second_name}
          </strong>
          <p className="line-clamp-3 text-[12px]">{message}</p>
        </div>
      </div>,
      {
        ...options,
        position: "bottom-right", // показываем в правом нижнем углу
        autoClose: 30000,
        icon: false, // Disable the default icon
      },
    );
  };

  return { toastSuccess, toastError, toastInfo, toastNewMessage };
};

export default useToastify;
