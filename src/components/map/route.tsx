"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
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

const currentLocationIcon = L.divIcon({
  html: ``,
  className: "bg-blue-600 w-[18px] h-[18px] rounded-full border-2 border-white",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function RouteMap({ course }: { course: Course }) {
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        setCurrentPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error("現在地の取得に失敗しました:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const route: LatLngExpression[] = course.routes.map((place) => [
    Number(place.latitude),
    Number(place.longitude),
  ]);

  const ToLatLng = (place: { latitude: string; longitude: string }) =>
    [Number(place.latitude), Number(place.longitude)] as LatLngExpression;

  return (
    <MapContainer center={route[0]} zoom={17} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={route} />

      {course.routes.map((place, index) => {
        const icon = L.divIcon({
          html: `${place.name?.charAt(0)}`,
          className:
            "rounded-full bg-blue-700 text-white text-lg font-mono text-center leading-[24px]",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        return place.display ? (
          <Marker position={route[index]} key={index} icon={icon}>
            <Popup>{place.title}</Popup>
          </Marker>
        ) : null;
      })}

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

      {currentPosition && (
        <Marker position={currentPosition} icon={currentLocationIcon} />
      )}
    </MapContainer>
  );
}

export default RouteMap;
