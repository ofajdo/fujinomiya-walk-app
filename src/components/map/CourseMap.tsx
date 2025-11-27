"use client";
import React, { useState } from "react";
import { CourseItem } from "@/components/course/CourseItem";
import LocationList from "./locationList";
import { CourseRouteRoad } from "./CourseRouteRoad";
import type { Prisma } from "@prisma/client";
import { TiArrowSortedUp } from "react-icons/ti";

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: {
      include: {
        place: true;
      };
    };
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

type CourseMapProps = {
  course: Course;
};

const CourseMap: React.FC<CourseMapProps> = ({ course }) => {
  return (
    <>
      <div className="w-full h-full flex-1">
        {course && <CourseRouteRoad course={course} />}
      </div>

      <div
        className={`flex-1 h-full w-full max-h-96 overflow-y-scroll sm:max-w-md sm:max-h-full`}
      >
        <div className="p-1">{course && <CourseItem course={course} />}</div>
        <LocationList course={course} />
      </div>
    </>
  );
};

export default CourseMap;
