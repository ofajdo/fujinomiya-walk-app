"use client";

import { Prisma } from "@prisma/client";
import { Overview } from "@/components/location/Overview";
import React from "react";
import WalkedButton from "@/components/map/Walked";

import { locationsDB } from "@/lib/localdb";

import { useLiveQuery } from "dexie-react-hooks";

type Location = Prisma.LocationGetPayload<{
  include: {
    course: true;
  };
}>;

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: true;
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

const LocationList = ({
  course,
  onWalked,
}: {
  course: Course | null;
  onWalked: (lcoation: any) => void;
}) => {
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];

  return (
    <ol className="flex flex-col">
      {course?.locations.map((location, index) => {
        return (
          <li
            key={index}
            className={`${
              !!items?.some((loc) => loc.id === location.id)
                ? "order-1"
                : "order-0"
            }`}
          >
            <div className={`w-full p-2`}>
              <Overview location={location}>
                <WalkedButton location={location} onWalked={onWalked} />
              </Overview>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default LocationList;
