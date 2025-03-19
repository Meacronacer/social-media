import SideBar from "@/components/shared/sidebar";
import { SocketProvider } from "@/providers/socketIoProvider";

export default function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <section className="flex">
        <SideBar />
        <main className="w-full pl-[300px]">{children}</main>
      </section>
    </SocketProvider>
  );
}
