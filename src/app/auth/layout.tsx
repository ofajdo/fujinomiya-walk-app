import { Logo } from "@/components/layout/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] flex flex-col bg-blue-100">
      <div className="backdrop-blur-md bg-opacity-50 bg-gray-300 flex justify-around items-center flex-wrap p-2 bg-[url(/header_back.svg)] bg-[center_bottom] bg-contain bg-no-repeat">
        <Logo />
      </div>
      <div className="flex h-[100dvh] items-center justify-center p-6">
        <div className="p-3 max-w-[768px] w-full bg-white rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
