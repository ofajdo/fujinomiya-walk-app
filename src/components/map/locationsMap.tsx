"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Prisma } from "@prisma/client";

// 分離したコンポーネントをインポート
import { LocationMarkers } from "./LocationMarkers"; // 作成したコンポーネント

// Prisma型 (types/course.ts などに分離推奨)
type Course = Prisma.CourseGetPayload<{
  include: {
    routes: true; // このマップでは使わないが型定義は合わせておく
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
    Number(place?.latitude || "35.222"), // フォールバック緯度
    Number(place?.longitude || "138.621"), // フォールバック経度
  ] as LatLngExpression;

function RouteMap({
  course,
  location_index,
}: {
  course: Course;
  location_index: number;
}) {
  // --- データ整形 ---

  // 中心座標の計算
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

      {/* マーカーの描画ロジックをコンポーネントに委譲
        このマップは訪問済み状態を考慮しないため、visitedItems は渡さない
      */}
      <LocationMarkers locations={course.locations} />
    </MapContainer>
  );
}

export default RouteMap;
