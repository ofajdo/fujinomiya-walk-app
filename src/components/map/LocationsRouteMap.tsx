"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
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

function ChangeMapCenter({
  position,
  onTracking,
}: {
  position: LatLngExpression | null;
  onTracking: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (position !== null && onTracking) {
      map.flyTo(position);
    }
  }, [map, position, onTracking]);

  return null;
}

const currentLocationIcon = L.divIcon({
  html: ``,
  className: "bg-blue-600 w-[18px] h-[18px] rounded-full border-2 border-white",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function StopTrackingOnMove({
  setOnTracking,
}: {
  setOnTracking: (v: boolean) => void;
}) {
  useMapEvents({
    dragstart: () => setOnTracking(false),
    zoomstart: () => setOnTracking(false),
  });
  return null;
}

function RouteMap({ course }: { course: Course }) {
  const [onTracking, setOnTracking] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startGeolocation = () => {
    setOnTracking(true);
    if (watchId !== null) return;
    if (typeof window === "undefined" || !navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
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
    setWatchId(id);
  };

  const route: LatLngExpression[] = course.routes.map((place) => [
    Number(place.latitude),
    Number(place.longitude),
  ]);

  const ToLatLng = (place: { latitude: string; longitude: string }) =>
    [Number(place.latitude), Number(place.longitude)] as LatLngExpression;

  return (
    <div className="h-full w-full relative">
      <button
        onClick={startGeolocation}
        className="absolute z-[10000] top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow"
      >
        現在地を表示
      </button>
      <MapContainer center={route[0]} zoom={17} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        />

        <StopTrackingOnMove setOnTracking={setOnTracking} />

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
          <>
            <Marker position={currentPosition} icon={currentLocationIcon} />
            <ChangeMapCenter
              position={currentPosition}
              onTracking={onTracking}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default RouteMap;
