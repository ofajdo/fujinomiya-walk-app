"use server";
import prisma from "@/lib/db";
import { truncate } from "fs";

export const CoursesGet = async () => {
  const courses = await prisma.course.findMany({
    include: {
      startingPoint: true,
      routes: {
        orderBy: {
          sort: "asc",
        },
      },
      points: {
        include: {
          point: true,
        },
      },
      locations: {
        orderBy: {
          number: "asc",
        },
        include: {
          course: true,
          place: true,
        },
      },
    },
  });
  return courses;
};

export const CourseGetById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      startingPoint: true,
      routes: {
        orderBy: {
          sort: "asc",
        },
      },
      points: {
        include: {
          point: true,
        },
      },
      locations: {
        orderBy: {
          number: "asc",
        },
        include: {
          course: true,
          place: true,
        },
      },
    },
  });
  return course;
};
