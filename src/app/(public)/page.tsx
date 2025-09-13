import { CoursesGet } from "@/data/courses";
import { CourseList } from "@/components/course/CourseList";
import type { Prisma } from "@prisma/client";
import PleaseText from "@/components/PleaseText";
import Link from "next/link";

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: true;
    routes: true; // orderByは型に影響しないので true でOK
    points: {
      include: {
        point: true;
      };
    };
    locations: {
      include: {
        course: true;
        place: true; // ここは null 許容される
      };
    };
  };
}>;

const Home = async () => {
  const courses: Course[] = await CoursesGet().catch(() => []);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold">
            富士宮市歩く博物館デジタル版へようこそ
          </h2>
        </div>
        <p className="text-center">※非公式のサイトです</p>
        <div>
          <PleaseText />
        </div>
        <div>
          <h3 className="mb-1 p-1 text-center font-medium text-blue-900 text-xl">
            コース一覧 （全24コース中 {courses.length}コース）
          </h3>
          <Link
            href="/course"
            className="p-3 w-full block text-center bg-gray-100 text-base font-medium my-2"
          >
            コース一覧
          </Link>
          {/*<CourseList courses={courses}></CourseList>*/}
        </div>
        <div>
          <h3 className="mb-1 p-1 text-center font-medium text-blue-900 text-xl">
            参考
          </h3>
          <p className="text-sm p-2 line-height">
            このアプリは、富士宮市教育委員会が提供する「富士宮市歩く博物館」のコース情報をもとに作成しています。
            <br />
            以下の市のサイトをご参照ください。
            <br />
            <a
              href="https://www.city.fujinomiya.lg.jp/3010400000/p001925.html"
              className="p-3 w-full block text-center bg-gray-100 text-base font-medium my-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              富士宮市歩く博物館
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
