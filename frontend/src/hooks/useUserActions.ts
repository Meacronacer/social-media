import { useRouter } from "next/navigation";
import { setNewUser } from "@/redux/slices/chatSlice";
import { useAppDispatch } from "./useRedux";
import { LinkTo } from "@/utils/links";
import { IAuthor } from "@/@types/user";

export const useUserActions = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSelectUser = (user: IAuthor) => {
    dispatch(setNewUser(user));
    router.push(LinkTo.chats);
  };

  return { handleSelectUser };
};
