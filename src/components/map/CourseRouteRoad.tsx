"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Prisma } from "@prisma/client";
type Course = Prisma.CourseGetPayload<{
  include: {
    routes: true;
    startingPoint: {
      include: {
        place: true;
      };
    };
    locations: {
      include: {
        place: true;
      };
    };
  };
}>;
export function CourseRouteRoad({ course }: { course: Course }) {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("./LocationsRouteMap"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return <Map course={course} />;
}
