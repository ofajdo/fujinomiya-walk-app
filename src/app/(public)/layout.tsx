import { Header } from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="justify-center w-full p-2 max-w-[768px] m-auto">
      <Header />
      <div className="p-2">{children}</div>
    </div>
  );
}
