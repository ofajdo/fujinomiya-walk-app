"use client";

import { locationsDB } from "@/lib/localdb";

import { useLiveQuery } from "dexie-react-hooks";

import { LocationSerchById } from "@/data/locations";
import { PostUserLocations, DeleteUserLocation } from "@/data/users";

import { Prisma } from "@prisma/client";

import { GetUser } from "@/actions/user";
import React from "react";

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

export const SyncUserLocation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];
  const [, setLocations] = React.useState<Location[] | null>(null);

  React.useEffect(() => {
    const fetchLocations = async () => {
      const user = await GetUser().catch((error) => null);

      if (user?.id)
        await PostUserLocations({
          id: items.map((item) => {
            return item.id;
          }),
          user: user.id,
        }).catch(() => null);

      if (!items || items.length === 0) {
        setLocations([]);
        return;
      }
      const locationPromises = items.map((item) => LocationSerchById(item));
      const resolvedLocations = await Promise.all(locationPromises);
      setLocations(
        resolvedLocations.filter((loc) => loc !== null) as Location[]
      );
    };
    fetchLocations();
  }, [items]);
  return <>{children}</>;
};
