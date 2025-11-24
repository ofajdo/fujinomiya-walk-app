"use client";

import React from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { Prisma } from "@prisma/client";
import { AnimatedPolyline, MovingMarker } from "./mapUtils";

// Prisma型 (types/course.ts などに分離推奨)
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

// Propsの型定義
interface MapLayersProps {
  course: Course;
  items: { id: string }[]; // Dexieから取得したアイテムの型（例）
  currentPosition: LatLngExpression | null;
  heading: number | null;
}

// ヘルパー関数
const toLatLng = (p: { latitude: string; longitude: string }) =>
  [Number(p.latitude), Number(p.longitude)] as LatLngExpression;

export function MapLayers({
  course,
  items,
  currentPosition,
  heading,
}: MapLayersProps) {
  // データ整形
  const route: LatLngExpression[] = course.routes.map((r) => [
    Number(r.latitude),
    Number(r.longitude),
  ]);
  const startPoint = course.startingPoint.place
    ? toLatLng(course.startingPoint.place)
    : null;

  return (
    <>
      {/* 経路（背景白 + アニメーション青） */}
      <Polyline
        positions={route}
        pathOptions={{ color: "white", weight: 6, opacity: 0.8 }}
      />
      <AnimatedPolyline route={route} />
      <MovingMarker route={route} speed={600} />

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
          <Marker position={route[i]} key={`route-${i}`} icon={icon}>
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

      {/* スタート地点 */}
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

      {/* 現在地＋方位 */}
      {currentPosition && (
        <Marker
          position={currentPosition}
          icon={L.divIcon({
            html: heading
              ? `<div style="transform: rotate(${Math.round(
                  heading
                )}deg);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path fill="currentColor" d="M11.992 52.375c1.172 0 1.922-.422 3.07-1.547l12.61-12.492c.117-.117.21-.211.328-.211c.117 0 .211.094.328.21l12.61 12.493c1.148 1.125 1.898 1.547 3.07 1.547c1.57 0 2.554-1.219 2.554-2.812c0-.891-.374-1.946-.726-2.907L31.188 6.625c-.75-2.062-1.852-3-3.188-3s-2.437.938-3.187 3L10.164 46.656c-.351.961-.726 2.016-.726 2.907c0 1.593.984 2.812 2.554 2.812"/></svg></div>`
              : "", // 方位がなければただの点
            className:
              "bg-blue-600 rounded-full border-2 border-white text-white",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          })}
        />
      )}
    </>
  );
}
