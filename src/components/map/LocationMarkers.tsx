"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { Prisma } from "@prisma/client";

// Prisma型 (types/course.ts などに分離推奨)
type LocationWithPlace = Prisma.LocationGetPayload<{
  include: {
    place: true;
  };
}>;

// ヘルパー関数 (lib/mapUtils.ts などに分離推奨)
const toLatLng = (p: { latitude: string; longitude: string }) =>
  [Number(p.latitude), Number(p.longitude)] as LatLngExpression;

// Propsの型定義
interface LocationMarkersProps {
  locations: LocationWithPlace[];
  /** 訪問済みの場所IDの配列 (dexieなどから取得) */
  visitedItems?: { id: string }[];
}

export function LocationMarkers({
  locations,
  visitedItems = [],
}: LocationMarkersProps) {
  return (
    <>
      {locations.map((loc, i) => {
        if (!loc.place) return null;

        // 訪問済みかどうかでスタイルを分岐
        const isVisited = visitedItems.some((v) => v.id === loc.id);
        const icon = L.divIcon({
          html: `${loc.number}`,
          className: `rounded-full text-sm font-mono text-center leading-[24px] ${
            isVisited
              ? "bg-gray-400 text-gray-100" // 訪問済み
              : "bg-gray-800 text-white" // 未訪問
          }`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        return (
          <Marker position={toLatLng(loc.place)} icon={icon} key={`loc-${i}`}>
            <Popup>{loc.title}</Popup>
          </Marker>
        );
      })}
    </>
  );
}
