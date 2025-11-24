import Image from "next/image";
import Link from "next/link";
import { signIn, signOut } from "@/auth";

import logoImg from "../../assets/logo.svg";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";
import { CoursesGet } from "@/data/courses";
import { GetUser } from "@/actions/user";

export function Logo() {
  return (
    <div className="max-w-40 w-full">
      <h1>
        <Link href="/">
          <Image src={logoImg} alt="富士宮歩く博物館" />
        </Link>
      </h1>
    </div>
  );
}

export function NavItem({
  href,
  icon,
  label,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex-1 text-center relative">
      <Link
        href={href}
        className="peer flex justify-center items-center hover:underline gap-1 text-nowrap"
      >
        {icon}
        {label}
      </Link>
      {children && (
        <div className="hidden hover:flex peer-hover:flex absolute pt-3 w-full flex-col items-center content-center">
          <div className="max-w-96 p-2 bg-gray-100 rounded backdrop-blur-md bg-opacity-90 shadow flex flex-col gap-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export async function CourseMenu() {
  const courses = await CoursesGet();
  return (
    <NavItem
      href="/course"
      icon={<FaRoute className="h-[1.25em] w-[1.25em]" />}
      label="コース"
    >
      {courses.map((course) => (
        <div key={course.id} className="text-sm font-normal">
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
      ))}
    </NavItem>
  );
}

export async function AccountMenu() {
  const user = await GetUser();

  return (
    <NavItem
      href="/auth"
      icon={<MdOutlineAccountCircle className="h-[1.25em] w-[1.25em]" />}
      label="アカウント"
    >
      {!user?.id ? (
        <>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 w-full"
            >
              Googleでログイン
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("line");
            }}
          >
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 w-full"
            >
              Lineでログイン
            </button>
          </form>
        </>
      ) : (
        <>
          <p>{user.name}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="bg-blue-500 text-white rounded p-2 w-full"
            >
              ログアウト
            </button>
          </form>
        </>
      )}
    </NavItem>
  );
}

export function Header() {
  return (
    <div className="sm:sticky py-2 top-2 z-[2000]">
      <div className="backdrop-blur-md bg-opacity-50 bg-gray-300 flex justify-around items-center shadow-md flex-wrap p-2 rounded-full bg-[url(/header_back.svg)] bg-[center_bottom] bg-contain bg-no-repeat">
        <Logo />
        <div className="flex justify-around flex-wrap flex-grow font-medium items-center">
          <CourseMenu />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
