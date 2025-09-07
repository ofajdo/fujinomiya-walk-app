import logoImg from "../../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] flex flex-col">
      <div className="backdrop-blur-md bg-opacity-50 bg-gray-100 flex justify-around items-center z-[2000] flex-wrap p-2 bg-[url(/header_back.svg)] bg-[center_bottom] bg-contain bg-no-repeat">
        <div className="max-w-48 w-full">
          <h1>
            <Link href="/">
              <Image src={logoImg} alt="富士宮歩く博物館" />
            </Link>
          </h1>
        </div>
      </div>
      <div className="flex flex-grow w-full flex-col sm:flex-row overflow-hidden">
        {children}
      </div>
    </div>
  );
}
