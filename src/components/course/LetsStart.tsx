"use client";
import type { Prisma } from "@prisma/client";
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

import { useState } from "react";

export default function LetsStart({ course }: { course: Course }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex justify-center py-1.5">
        <button
          className="py-1.5 px-4 rounded-md font-medium border-2 border-gray-400 w-full"
          onClick={() => setIsOpen(true)}
        >
          このコースを歩く！
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-2 rounded-2xl max-w-lg w-full shadow-lg flex flex-col content-around items-around gap-1 max-h-full  overflow-y-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 p-1 text-center font-medium text-blue-900 text-xl">
              スタート地点
            </h3>
            <div className="flex py-1 content-center justify-around flex-wrap items-center gap-1">
              <h4 className="font-bold text-gray-700 text-sm">
                {course.startingPoint.name}
              </h4>
              <ul className="flex justify-around flex-wrap gap-2">
                <li className="py-1 px-3 bg-gray-200 rounded-full text-sm">
                  <a href={course.startingPoint.google}>GoogleMap</a>
                </li>
                <li className="py-1 px-3 bg-gray-200 rounded-full text-sm">
                  {course.startingPoint.address}
                </li>
              </ul>
            </div>
            <div>
              <div className="flex justify-center py-1.5">
                <Link
                  href={`/map/${course.id}`}
                  className="py-1.5 px-6 bg-blue-600 text-white rounded-full  text-center"
                  onClick={() => setIsOpen(true)}
                >
                  マップを開く
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
