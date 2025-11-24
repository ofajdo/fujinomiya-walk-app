import { Logo } from "@/components/layout/Header";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] flex flex-col">
      <div className="backdrop-blur-md bg-opacity-50 bg-gray-100 flex justify-around items-center flex-wrap p-2 bg-[url(/header_back.svg)] bg-[center_bottom] bg-contain bg-no-repeat">
        <Logo />
      </div>
      <div className="flex flex-grow w-full flex-col sm:flex-row-reverse overflow-hidden">
        {children}
      </div>
    </div>
  );
}
