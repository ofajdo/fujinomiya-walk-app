"use client";
import type { Prisma } from "@prisma/client";

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

import { CourseItem } from "./CourseItem";

export function CourseList({ courses }: { courses: Course[] }) {
  return (
    <ol className="w-full flex flex-col gap-4">
      {courses?.map((course: Course, index) => {
        return (
          <li key={index} className="p-4 bg-gray-100 rounded-xl shadow-md">
            <CourseItem course={course} />
          </li>
        );
      })}
    </ol>
  );
}
