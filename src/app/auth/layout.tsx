import Image from "next/image";
import Link from "next/link";
import logoImg from "../../assets/logo.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] flex flex-col bg-blue-100">
      <div className="backdrop-blur-md bg-opacity-50 bg-gray-300 flex justify-around items-center z-[2000] flex-wrap p-2 bg-[url(/header_back.svg)] bg-[center_bottom] bg-contain bg-no-repeat">
        <div className="max-w-56 w-full">
          <h1>
            <Link href="/">
              <Image src={logoImg} alt="富士宮歩く博物館" />
            </Link>
          </h1>
        </div>
      </div>
      <div className="flex h-[100dvh] items-center justify-center p-6">
        <div className="p-3 max-w-[768px] w-full bg-white rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
