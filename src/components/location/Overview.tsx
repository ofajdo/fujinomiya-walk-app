"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { locationsDB } from "@/lib/localdb";

import { Prisma } from "@prisma/client";
type Location = Prisma.LocationGetPayload<{
  include: {
    course: true;
  };
}>;
export function Overview({
  location,
  children,
}: {
  location: Location;
  children: React.ReactNode;
}) {
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {!!items?.some((loc) => loc.id === location.id) && (
        <div className="absolute top-0 left-0 bg-lime-400 h-full w-2 z-10">
          <div></div>
        </div>
      )}
      <div
        className={`flex flex-wrap px-3 ${
          !!items?.some((loc) => loc.id === location.id) && "opacity-70"
        }`}
      >
        <div
          className="w-36 max-w-[30%] flex items-center"
          onClick={() => setIsOpen(true)}
        >
          {location?.image && (
            <Image
              src={location.image}
              alt={`${location.title}｜${location.description}`}
              width={240}
              height={240}
              className="rounded-lg"
            />
          )}
        </div>
        <div className="flex-1 p-1 flex flex-col justify-around gap-25">
          <p className="text-center text-xs md:text-sm line-clamp-1">
            <span className="text-sm font-bold pr-2 font-mono">
              {location?.course.name}-{location?.number}
            </span>
            {location?.course.title}
          </p>
          <h2 className="font-medium text-lg md:text-2xl text-center text-balance cursor-pointer hover:underline line-clamp-2">
            <Link href={`/location/${location?.id}`}>{location?.title}</Link>
          </h2>
          <div className="flex justify-center flex-wrap">{children}</div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed p-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-2 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={location.image}
              alt={`${location.title}｜${location.description}`}
              width={240}
              height={240}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
