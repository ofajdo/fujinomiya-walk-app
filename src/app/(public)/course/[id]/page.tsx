import { CourseItem } from "@/components/course/CourseItem";
import { Overview } from "@/components/location/Overview";
import { CourseRouteRoad } from "@/components/map/CourseRouteRoad";
import { CourseGetById, CoursesGet } from "@/data/courses";
import LetsStart from "@/components/course/LetsStart";
import React from "react";
import Link from "next/link";
import WalkedButton from "@/components/map/Walked";

const courses = await CoursesGet();

export const generateStaticParams = () => {
  return courses.map((c) => ({
    id: c.id,
  }));
};

export default async function Course({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return <div className="p-4">コースが見つかりませんでした。</div>;
  }
  return (
    <div>
      <div className="p-1 my-4">
        {course && <CourseItem course={course} />}
        <LetsStart course={course} />
        <p className="text-center text-sm">
          <Link href={`/map/${course.id}`}>マップを開く</Link>
        </p>
      </div>
      <ol className="flex flex-col">
        {course?.locations.map((location, index) => {
          return (
            <li key={index}>
              <div className="w-full p-2">
                <Overview location={location}>
                  <WalkedButton location={location} />
                </Overview>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
