import React from "react";
import { CourseItem } from "../course/courseItem";
import LocationList from "./locationList";
import { CourseRouteRoad } from "./CourseRouteRoad";
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

type CourseMapProps = {
  course: Course;
};

const CourseMap: React.FC<CourseMapProps> = ({ course }) => {
  return (
    <>
      <div className="flex-1 overflow-y-scroll h-full md:max-w-md">
        <div className="p-1">{course && <CourseItem course={course} />}</div>
        <LocationList course={course} />
      </div>
      <div className="h-full w-full flex-1">
        {course && <CourseRouteRoad course={course} />}
      </div>
    </>
  );
};

export default CourseMap;
