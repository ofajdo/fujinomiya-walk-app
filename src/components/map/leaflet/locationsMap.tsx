"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Prisma } from "@prisma/client";

import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

import { LocationMarkers } from "./LocationMarkers";
import { FullscreenControl } from "./mapUtils";

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

// ヘルパー関数 (lib/mapUtils.ts などに分離推奨)
const toLatLng = (place: { latitude: string; longitude: string } | null) =>
  [
    Number(place?.latitude || "35.222"),
    Number(place?.longitude || "138.621"),
  ] as LatLngExpression;

function RouteMap({
  course,
  location_index,
}: {
  course: Course;
  location_index: number;
}) {
  const centerPlace =
    course.locations.find((location) => location.number === location_index)
      ?.place || null;

  const centerPosition = toLatLng(centerPlace);

  return (
    <MapContainer
      center={centerPosition}
      minZoom={10}
      maxZoom={18}
      zoom={18}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FullscreenControl />
      <LocationMarkers locations={course.locations} />
    </MapContainer>
  );
}

export default RouteMap;
