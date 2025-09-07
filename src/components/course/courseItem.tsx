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

import { FaWalking } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import { useState } from "react";
import Link from "next/link";

export function CourseItem({ course }: { course: Course }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col sm:flex-row">
      <div className="grid place-items-center">
        <div className="flex justify-center sm:flex-col items-center gap-2 text-xs text-center">
          <span className="text-blue-500 text-3xl sm:text-4xl font-bold px-2">
            {course.name}
          </span>
          {course.districts}地区
        </div>
      </div>
      <div className="flex-grow px-1">
        <h2 className="text-2xl text-center font-medium cursor-pointer hover:underline text-balance">
          <Link href={`/course/${course.id}`}>{course.title}</Link>
        </h2>
        <div className="p-2">
          <p
            className="text-xs text-gray-700 line-clamp-1 cursor-pointer hover:underline"
            onClick={() => setIsOpen(true)}
          >
            {course.description}
          </p>
        </div>
        <div className="p-2 flex">
          <div className="w-[50%] flex justify-center items-center">
            <FaWalking className="h-[1.25rem] w-[1.25rem]" />
            {`約${course.distance}km`}
          </div>
          <div className="w-[50%] flex justify-center items-center">
            <IoMdTime className="h-[1.25rem] w-[1.25rem]" />
            {`約${course.time}時間`}
          </div>
        </div>
        <div>
          <ul></ul>
        </div>
      </div>
      {/* モーダル */}
      {isOpen && (
        <div
          className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2050]"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-2xl max-w-lg w-full shadow-lg flex flex-col max-h-full  overflow-y-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 p-1 text-center font-medium text-blue-900 text-xl">
              見どころ
            </h3>
            <p className="text-sm text-gray-800">{course.description}</p>
            <div className="flex py-3 content-center justify-around flex-wrap items-center gap-1">
              <h4 className="m-2 font-bold text-gray-700 text-sm">ポイント</h4>
              <ul className="flex justify-around flex-wrap">
                {course.points?.length ? (
                  course.points.map(({ point }, index) => (
                    <li
                      className="py-2 px-3 bg-gray-200 rounded-full text-sm"
                      key={index}
                    >
                      {point?.title ?? "タイトルなし"}
                    </li>
                  ))
                ) : (
                  <li>ポイントがありません</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
