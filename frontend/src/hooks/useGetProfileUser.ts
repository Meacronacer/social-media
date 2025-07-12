"use client";
import { useGetUserQuery } from "@/api/userApi";
import { useAppSelector } from "@/hooks/useRedux";
import { selectGetMeResult } from "@/redux/selectors/userSelector";
import { useParams } from "next/navigation";

export const useGetProfileUser = (isOwnPage: boolean) => {
  // Вызываем хуки unconditionally
  const authUser = useAppSelector(selectGetMeResult);
  const params = useParams();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId || "";
  const { data: userData } = useGetUserQuery(userId, { skip: !userId });

  // Возвращаем нужное значение в зависимости от isOwnPage
  return isOwnPage ? authUser?.data : userData;
};
