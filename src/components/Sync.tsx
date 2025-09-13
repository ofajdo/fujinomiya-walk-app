"use client";

import { locationsDB } from "@/lib/localdb";

import { useLiveQuery } from "dexie-react-hooks";

import { PostUserLocations, GetUserLocations } from "@/data/users";

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

  React.useEffect(() => {
    const fetchLocations = async () => {
      const user = await GetUser().catch((error) => null);

      if (user?.id) {
        await PostUserLocations({
          id: items.map((item) => {
            return item.id;
          }),
          user: user.id,
        }).catch(() => null);
        const dbData = await GetUserLocations({ user: user.id });
        dbData.map(async (data) => {
          if (items.includes(data))
            try {
              await locationsDB.items.add(data);
            } catch {}
        });
      }
    };
    fetchLocations();
  }, [items]);

  return <>{children}</>;
};
