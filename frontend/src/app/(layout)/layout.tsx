import { cookies } from "next/headers";
import SideBar from "@/components/shared/sidebar";
import { SocketProvider } from "@/providers/socketIoProvider";

export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  console.log("ACCESS (RSC):", cookieStore.get("accessToken")?.value);
  console.log("REFRESH (RSC):", cookieStore.get("refreshToken")?.value);

  return (
    <SocketProvider>
      <section className="flex">
        <SideBar />
        <main className="w-full pl-[300px]">{children}</main>
      </section>
    </SocketProvider>
  );
}
