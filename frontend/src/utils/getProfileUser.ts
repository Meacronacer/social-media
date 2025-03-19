"use client";
import { useGetUserQuery } from "@/api/user";
import { useAppSelector } from "@/hooks/useRedux";
import { useParams } from "next/navigation";

export const getProfileUserId = (isOwnPage: boolean) => {
  let user;

  if (isOwnPage) {
    user = useAppSelector((state) => state.authSlice.user);
  } else {
    const { userId } = useParams(); // Получаем объект router
    const userIdString = Array.isArray(userId) ? userId[0] : userId || "";
    const { data } = useGetUserQuery(userIdString);
    user = data;
  }

  return user;
};
