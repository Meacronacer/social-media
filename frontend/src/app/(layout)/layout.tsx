import SideBar from "@/components/shared/sidebar";
import { SocketProvider } from "@/providers/socketIoProvider";
import { API_URL } from "@/utils/baseFetchInstance";
import { LinkTo } from "@/utils/links";

export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await fetch(`${API_URL}/api/auth/vefiry-tokens`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    // Если ответ не успешный, перенаправляем на страницу логина
    if (typeof window !== "undefined") {
      window.location.href = LinkTo.login;
    }
  }

  return (
    <SocketProvider>
      <section className="flex">
        <SideBar />
        <main className="w-full pl-[300px]">{children}</main>
      </section>
    </SocketProvider>
  );
}
