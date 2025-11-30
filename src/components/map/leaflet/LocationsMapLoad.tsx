"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Prisma } from "@prisma/client";
type Course = Prisma.CourseGetPayload<{
  include: {
    routes: true;
    locations: {
      include: {
        place: true;
      };
    };
  };
}>;
export function LocationsRoad({
  course,
  location_index,
}: {
  course: Course;
  location_index: number;
}) {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("./locationsMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return <Map course={course} location_index={location_index} />;
}
