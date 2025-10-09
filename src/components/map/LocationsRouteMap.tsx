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

// Prisma型
type Course = Prisma.CourseGetPayload<{
  include: {
    routes: true;
    startingPoint: {
      include: { place: true };
    };
    locations: {
      include: { place: true };
    };
  };
}>;

// 地図の中心を動的に追従
function ChangeMapCenter({
  position,
  onTracking,
}: {
  position: LatLngExpression | null;
  onTracking: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (position && onTracking) map.panTo(position);
  }, [map, position, onTracking]);
  return null;
}

// 地図操作で追跡解除
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

// 矢印アイコン
const arrowIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-[12px] w-[12px]" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="none"/><g fill="currentColor"><path d="M9.5 1.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906l.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154l-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613l-.435.489l-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/><path d="M6.25 11.745v-1.418l1.204 1.375l.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215l-.494-.494l.205-1.843l.006-.067l1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/></g></svg>`,
  className:
    "text-white bg-blue-600 p-[4px] rounded-full transition-all duration-[1s]",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// 動くマーカー（経路表示アニメ）
function MovingMarker({
  route,
  speed,
}: {
  route: LatLngExpression[];
  speed: number;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!route.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % route.length);
    }, speed);
    return () => clearInterval(interval);
  }, [route, speed]);
  return <Marker position={route[index]} icon={arrowIcon} />;
}

// アニメ付きポリライン
export function AnimatedPolyline({ route }: { route: LatLngExpression[] }) {
  const ref = useRef<L.Polyline | null>(null);
  useEffect(() => {
    let offset = 0;
    const animate = () => {
      const path = ref.current?.getElement() as SVGPathElement | null;
      if (path) {
        offset = (offset + 1) % 100;
        path.style.strokeDasharray = "10 10";
        path.style.strokeDashoffset = String(-offset);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return (
    <Polyline
      ref={ref}
      positions={route}
      pathOptions={{ color: "blue", weight: 3 }}
    />
  );
}

// メイン
function RouteMap({ course }: { course: Course }) {
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];
  const [onTracking, setOnTracking] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [iosFlag, setIosFlag] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  // iOS or Android 判定
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    if (
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && "ontouchend" in document)
    ) {
      setIosFlag(true);
      setIsDisabled(false);
    } else if (/Android/.test(ua)) {
      setIsDisabled(false);
    }
  }, []);

  // 方位センサー開始
  const startOrientation = () => {
    const handleOrientation = (
      e: DeviceOrientationEvent & { webkitCompassHeading?: number }
    ) => {
      if (e.webkitCompassHeading !== undefined) {
        // ✅ iOS北基準
        setHeading(e.webkitCompassHeading);
      } else if (e.absolute && e.alpha !== null) {
        // ✅ Android北基準
        setHeading(360 - e.alpha);
      } else if (e.alpha !== null) {
        // ⚙ フォールバック（相対値）
        setHeading(360 - e.alpha);
      }
    };

    const win = window as unknown as Window;
    if ("ondeviceorientationabsolute" in win) {
      (win as Window).addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    } else {
      (win as Window).addEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    }
  };

  // iOS用ボタン押下時
  const check = () => {
    setIsDisabled(true);
    if (iosFlag && "requestPermission" in DeviceOrientationEvent) {
      (DeviceOrientationEvent.requestPermission as () => Promise<string>)()
        .then((res: string) => {
          if (res === "granted") startOrientation();
          else alert("方向センサーの使用が許可されませんでした。");
        })
        .catch(() => alert("方向センサーの権限リクエストに失敗しました。"));
    } else {
      startOrientation();
    }
  };

  // 位置情報トラッキング
  const startGeolocation = () => {
    setOnTracking(true);
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("位置情報取得失敗:", err);
        alert("現在地の取得に失敗しました。");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );

    setWatchId(id);
    check();
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", () => {});
      window.removeEventListener("deviceorientationabsolute", () => {});
    };
  }, [watchId]);

  // データ整形
  const route: LatLngExpression[] = course.routes.map((r) => [
    Number(r.latitude),
    Number(r.longitude),
  ]);
  const toLatLng = (p: { latitude: string; longitude: string }) =>
    [Number(p.latitude), Number(p.longitude)] as LatLngExpression;
  const startPoint = course.startingPoint.place
    ? toLatLng(course.startingPoint.place)
    : null;

  return (
    <div className="h-full w-full relative">
      <button
        onClick={startGeolocation}
        className="absolute z-[1000] top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow"
      >
        現在地を表示
      </button>

      <MapContainer
        center={route[0]}
        zoom={16}
        minZoom={10}
        maxZoom={18}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        <StopTrackingOnMove setOnTracking={setOnTracking} />

        <Polyline
          positions={route}
          pathOptions={{ color: "white", weight: 6, opacity: 0.8 }}
        />
        <AnimatedPolyline route={route} />

        {/* 経路ポイント */}
        {course.routes.map((p, i) => {
          const icon = L.divIcon({
            html: `${p.name?.charAt(0)}`,
            className:
              "rounded-full bg-blue-700 text-white text-lg font-mono text-center leading-[24px]",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          return p.display ? (
            <Marker position={route[i]} key={i} icon={icon}>
              <Popup>{p.title}</Popup>
            </Marker>
          ) : null;
        })}

        {/* 目的地 */}
        {course.locations.map((loc, i) => {
          if (!loc.place) return null;
          const icon = L.divIcon({
            html: `${loc.number}`,
            className: `rounded-full text-sm font-mono text-center leading-[24px] ${
              items?.some((v) => v.id === loc.id)
                ? "bg-gray-400 text-gray-100"
                : "bg-gray-800 text-white"
            }`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          return (
            <Marker position={toLatLng(loc.place)} icon={icon} key={i}>
              <Popup>{loc.title}</Popup>
            </Marker>
          );
        })}

        {/* 現在地＋方位 */}
        {currentPosition && (
          <>
            <Marker
              position={currentPosition}
              icon={L.divIcon({
                html: heading
                  ? `<div style="transform: rotate(${Math.round(
                      heading
                    )}deg);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M11.992 52.375c1.172 0 1.922-.422 3.07-1.547l12.61-12.492c.117-.117.21-.211.328-.211c.117 0 .211.094.328.21l12.61 12.493c1.148 1.125 1.898 1.547 3.07 1.547c1.57 0 2.554-1.219 2.554-2.812c0-.891-.374-1.946-.726-2.907L31.188 6.625c-.75-2.062-1.852-3-3.188-3s-2.437.938-3.187 3L10.164 46.656c-.351.961-.726 2.016-.726 2.907c0 1.593.984 2.812 2.554 2.812"/></svg></div>`
                  : "",
                className:
                  "bg-blue-600 rounded-full border-2 border-white text-white",
                iconSize: [18, 18],
                iconAnchor: [9, 9],
              })}
            />
            <ChangeMapCenter
              position={currentPosition}
              onTracking={onTracking}
            />
          </>
        )}

        <MovingMarker route={route} speed={600} />

        {/* スタート */}
        {startPoint && (
          <Marker
            position={startPoint}
            icon={L.divIcon({
              html: "スタート",
              className: "bg-blue-600 text-white rounded text-center",
              iconSize: [54, 18],
              iconAnchor: [27, 9],
            })}
          >
            <Popup>{course.startingPoint.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default RouteMap;
