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
  const [open, setOpen] = useState(true);

  return (
    <>
      <div className="w-full h-full flex-1">
        {course && <CourseRouteRoad course={course} />}
      </div>

      <button
        className="bg-gray-200 flex justify-center sm:flex-col"
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}
      >
        <div className="sm:rotate-90">
          <div className={`${open && "rotate-180"}`}>
            <TiArrowSortedUp className="text-2xl" />
          </div>
        </div>
      </button>

      <div
        className={`flex-1 h-full w-full ${
          open ? "max-h-70" : "max-h-10"
        } overflow-y-scroll ${
          open ? "sm:max-w-md" : "sm:hidden"
        }  sm:max-h-full`}
      >
        <div className="p-1">{course && <CourseItem course={course} />}</div>
        <LocationList course={course} />
      </div>
    </>
  );
};

export default CourseMap;
