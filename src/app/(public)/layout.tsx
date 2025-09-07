import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/auth";

import logoImg from "../../assets/logo.svg";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";
import { CoursesGet } from "@/data/courses";
import { GetUser } from "@/actions/user";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courses = await CoursesGet();

  const user = await GetUser();
  const username = user?.name;

  return (
    <div className="justify-center w-full p-2 max-w-[768px] m-auto">
      <div className="sm:sticky py-2 top-2">
        <div className="backdrop-blur-md bg-opacity-50 bg-gray-300 flex justify-around items-center shadow-md z-[2000] flex-wrap p-2 rounded-full bg-[url(/header_back.svg)]  bg-[center_bottom]  bg-contain bg-no-repeat">
          <div className="max-w-56 w-full">
            <h1>
              <Link href="/">
                <Image src={logoImg} alt="富士宮歩く博物館" />
              </Link>
            </h1>
          </div>
          <div className="flex justify-around flex-wrap flex-grow font-medium items-center">
            <div className="flex-1 text-center relative">
              <Link
                href="/course"
                className="peer flex justify-center items-center hover:underline gap-1"
              >
                <FaRoute className="h-[1.25em] w-[1.25em]" />
                コース
              </Link>
              <div className="hidden hover:flex peer-hover:flex absolute pt-3 w-full flex-col items-center content-center">
                <div className="max-w-96 p-2 bg-gray-100 rounded backdrop-blur-md bg-opacity-90 shadow flex flex-col gap-2">
                  {courses.map((course, index) => {
                    return (
                      <div key={index} className="text-sm font-normal">
                        <Link
                          href={`/course/${course.id}`}
                          className="hover:underline line-clamp-1"
                        >
                          <span className="p-1 font-medium font-mono text-base">
                            {course.name}
                          </span>
                          {course.title}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1 text-center relative">
              <Link
                href="/auth"
                className="peer flex justify-center items-center hover:underline gap-1"
              >
                <MdOutlineAccountCircle className="h-[1.25em] w-[1.25em]" />
                アカウント
              </Link>
              <div className="hidden hover:flex peer-hover:flex absolute pt-4 w-full flex-col items-center content-center">
                <div className="max-w-96 p-2 bg-gray-100 rounded backdrop-blur-md bg-opacity-90 shadow">
                  <p>{username}</p>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("google");
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-blue-500 text-white rounded p-2"
                    >
                      ログイン
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {/*
            <div className="p-1 flex-1 text-center">
              <Link
                href="/course"
                className="flex justify-center items-center hover:underline gap-1"
              >
                <IoSearchSharp className="h-[1.25em] w-[1.25em]" />
              </Link>
              検索
            </div>
            */}
          </div>
        </div>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}
