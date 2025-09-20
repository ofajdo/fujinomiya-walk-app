"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { locationsDB } from "@/lib/localdb";
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
      map.panTo(position);
    }
  }, [map, position, onTracking]);

  return null;
}

const currentLocationIcon = L.divIcon({
  html: ``,
  className: "bg-blue-600 rounded-full border-2 border-white",
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

const arrowIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-[12px] w-[12px]" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="none"/><g fill="currentColor"><path d="M9.5 1.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906l.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154l-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613l-.435.489l-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/><path d="M6.25 11.745v-1.418l1.204 1.375l.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215l-.494-.494l.205-1.843l.006-.067l1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/></g></svg>`,
  className:
    "text-white bg-blue-600 p-[4px] rounded-full transition-all duration-[1s]",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MovingMarker({
  route,
  speed,
}: {
  route: LatLngExpression[];
  speed: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (route.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % route.length);
    }, speed);

    return () => clearInterval(interval);
  }, [route]);

  return <Marker position={route[index]} icon={arrowIcon} />;
}

export function AnimatedPolyline({ route }: { route: LatLngExpression[] }) {
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    let offset = 0;
    let animationFrameId: number;

    const animate = () => {
      if (polylineRef.current) {
        const path = polylineRef.current.getElement() as SVGPathElement | null;
        if (path) {
          offset = (offset + 1) % 100; // 0〜100を繰り返す
          path.style.strokeDasharray = "10 10";
          path.style.strokeDashoffset = String(-offset);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return (
    <Polyline
      ref={polylineRef}
      positions={route}
      pathOptions={{
        color: "blue",
        weight: 3,
        opacity: 1,
      }}
    />
  );
}

function RouteMap({ course }: { course: Course }) {
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];
  const [onTracking, setOnTracking] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const [heading, setHeading] = useState<number | null>(null); // 方位
  const [iosFlag, setIosFlag] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const ua: string[] = ["iPod", "iPad", "iPhone"];

  // 初期判定（iOS/Android/PC）
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.DeviceOrientationEvent && "ontouchstart" in window) {
      // mobile
      for (let i = 0; i < ua.length; i++) {
        if (window.navigator.userAgent.indexOf(ua[i]) > 0) {
          setIosFlag(true);
          setIsDisabled(false);
          return;
        }
      }

      if (window.navigator.userAgent.indexOf("Android") > 0) {
        setIsDisabled(false);
      }
    }
  }, []);

  const check = () => {
    setIsDisabled(true);

    if (iosFlag) {
      // iOS Safari 用
      try {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((res: string) => {
            if (res === "granted") {
              startOrientation();
            } else {
              alert("方向の取得に失敗しました");
            }
          });
      } catch (e) {
        alert("方向の取得に失敗しました");
        alert(e);
      }
    } else {
      // Android
      startOrientation();
    }
  };

  const startOrientation = () => {
    window.addEventListener(
      "deviceorientation",
      (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setHeading(event.alpha); // 北を0°とした角度
        }
      }
    );
  };

  const startGeolocation = () => {
    setOnTracking(true);

    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    // 現在地取得
    const id = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        setCurrentPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error("現在地の取得に失敗しました:", error);
        alert("現在地の取得に失敗しました");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
    setWatchId(id);
    check();
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      window.removeEventListener("deviceorientation", () => {});
    };
  }, [watchId]);

  const route: LatLngExpression[] = course.routes.map((place) => [
    Number(place.latitude),
    Number(place.longitude),
  ]);

  const ToLatLng = (place: { latitude: string; longitude: string }) =>
    [Number(place.latitude), Number(place.longitude)] as LatLngExpression;

  return (
    <div className="h-full w-full relative">
      {heading !== null && (
        <div className="none">🧭 向いている方向: {Math.round(heading)}°</div>
      )}
      <button
        onClick={startGeolocation}
        className="absolute z-[1000] top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow"
      >
        現在地を表示
      </button>
      <MapContainer
        minZoom={10}
        maxZoom={18}
        center={route[0]}
        zoom={16}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
          className="[&_.leaflet-tile]:saturate-50 [&_.leaflet-tile]:contrast-90 [&_.leaflet-tile]:!opacity-70"
        />

        <StopTrackingOnMove setOnTracking={setOnTracking} />

        <Polyline
          positions={route}
          pathOptions={{
            color: "white",
            weight: 8,
            opacity: 1,
          }}
        />
        <AnimatedPolyline route={route} />
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
            className: `rounded-full text-sm font-mono text-center leading-[24px] ${
              !!items?.some((loc) => loc.id === location.id)
                ? "bg-gray-400 text-gray-100"
                : "bg-gray-800 text-white"
            }`,
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
        <MovingMarker route={route} speed={600} />
      </MapContainer>
    </div>
  );
}

export default RouteMap;
