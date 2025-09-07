"use client";

import { Prisma } from "@prisma/client";
import { Overview } from "@/components/location/overview";
import React from "react";
import WalkedButton from "./walked";

import { locationsDB } from "@/lib/localdb";

import { useLiveQuery } from "dexie-react-hooks";

import { LocationSerchById } from "@/data/locations";
import { PostUserLocations, DeleteUserLocation } from "@/data/users";

import { GetUser } from "@/actions/user";

type Location = Prisma.LocationGetPayload<{
  include: {
    course: true;
  };
}>;

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
                ? "opacity-50 order-2"
                : "order-1"
            }`}
          >
            <div className={`w-full p-2`}>
              <Overview location={location}>
                <WalkedButton
                  location={location}
                  onWalked={async () => {
                    const user = await GetUser().catch((err) => {
                      console.log(err);
                      return null;
                    });
                    console.log(user);
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
