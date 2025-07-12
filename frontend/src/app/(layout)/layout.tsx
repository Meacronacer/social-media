import SideBar from "@/components/shared/sidebar";
import DataFetcher from "@/providers/dataFetcher";
import { SocketProvider } from "@/providers/socketIoProvider";

export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <DataFetcher>
        <section className="flex">
          <SideBar />
          <main className="w-full pl-[300px]">{children}</main>
        </section>
      </DataFetcher>
    </SocketProvider>
  );
}
