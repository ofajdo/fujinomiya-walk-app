"use client";

import { Prisma } from "@prisma/client";
import { Overview } from "@/components/location/Overview";
import React from "react";
import WalkedButton from "@/components/map/Walked";

import { locationsDB } from "@/lib/localdb";

import { useLiveQuery } from "dexie-react-hooks";

import { DeleteUserLocation } from "@/data/users";

import { GetUser } from "@/actions/user";

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

const LocationList = ({ course }: { course: Course | null }) => {
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
                <WalkedButton
                  location={location}
                  onWalked={async () => {
                    const user = await GetUser().catch((err) => null);
                    if (items?.some((loc) => loc.id === location.id)) {
                      locationsDB.items.delete(location.id);
                      if (user?.id)
                        await DeleteUserLocation({
                          id: location.id,
                          user: user.id,
                        }).catch(() => null);
                    } else {
                      locationsDB.items.add({ id: location.id });
                    }
                  }}
                  walked={
                    !!items?.some((loc) => loc.id === location.id) || false
                  }
                />
              </Overview>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default LocationList;
