import { CourseGetById, CoursesGet } from "@/data/courses";
import React from "react";
import type { Prisma } from "@prisma/client";
import CourseMap from "@/components/map/CourseMap";

const courses = await CoursesGet();

export const generateStaticParams = () => {
  return courses.map((c) => ({
    id: c.id,
  }));
};

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: {
      include: {
        place: true;
      };
    };
    routes: true;
    points: {
      include: {
        point: true;
      };
    };
    locations: {
      include: {
        course: true;
        place: true;
      };
    };
  };
}>;

export default async function Course({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  return (
    <>
      <CourseMap course={course!} />
    </>
  );
}
