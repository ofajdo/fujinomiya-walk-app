"use client";

import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

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

function RouteMap({
  course,
  location_index,
}: {
  course: Course;
  location_index: number;
}) {
  const route: LatLngExpression[] = course.routes.map((place) => [
    Number(place.latitude),
    Number(place.longitude),
  ]);

  const ToLatLng = (place: { latitude: string; longitude: string }) =>
    [
      Number(place?.latitude || "35.222091619682374"),
      Number(place?.longitude || "138.62160835395053"),
    ] as LatLngExpression;

  return (
    <MapContainer
      center={ToLatLng(
        course.locations.find((location) => location.number === location_index)
          ?.place!
      )}
      minZoom={10}
      maxZoom={18}
      zoom={18}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {course.locations.map((location, index) => {
        if (!location.place) return null;
        const icon = L.divIcon({
          html: `${location.number}`,
          className:
            "rounded-full bg-gray-700 text-white text-lg font-mono text-center leading-[24px]",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        return (
          <Marker position={ToLatLng(location.place)} icon={icon} key={index}>
            <Popup>
              <div>{location.title}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default RouteMap;
