"use client";
import type { Metadata } from "next";
import SideBar from "@/components/shared/sidebar";
import { SocketProvider } from "@/providers/socketIoProvider";
import { useGetMeQuery } from "@/api/auth";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser } from "@/redux/slices/authSlice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const { data = null, isSuccess } = useGetMeQuery({});

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data)); // Сохраняем данные пользователя в Redux
    }
  }, [isSuccess, data, dispatch]);

  return (
    <SocketProvider>
      <section className="flex">
        <SideBar />
        <main className="w-full pl-[300px]">{children}</main>
      </section>
    </SocketProvider>
  );
}
