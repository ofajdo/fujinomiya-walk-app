"use client";

import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { locationsDB } from "@/lib/localdb";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Prisma } from "@prisma/client";

import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

// 分離したフックとコンポーネントをインポート
import { useGeolocation } from "./hooks/useGeolocation";
import { useOrientation } from "./hooks/useOrientation";
import { ChangeMapCenter, StopTrackingOnMove } from "./mapUtils";
import { MapLayers } from "./mapRouteLayers";
import { FullscreenControl } from "./hooks/useFullscreen";

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

function RouteMap({ course }: { course: Course }) {
  // --- データとロジックの呼び出し ---
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];
  const { onTracking, setOnTracking, currentPosition, startGeolocation } =
    useGeolocation();
  const { heading, requestPermission } = useOrientation();

  // --- イベントハンドラ ---
  const handleStartTracking = () => {
    startGeolocation(); // 位置情報取得開始
    requestPermission(); // 方位センサー権限要求 (フック内でUA判定済み)
  };

  // --- 初期値の計算 ---
  const initialCenter: LatLngExpression = course.routes.length
    ? [Number(course.routes[0].latitude), Number(course.routes[0].longitude)]
    : [35.681, 139.767]; // フォールバック (例: 東京駅)

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={initialCenter}
        zoom={16}
        minZoom={10}
        maxZoom={18}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        <button
          onClick={handleStartTracking}
          className="absolute z-[1000] top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded shadow"
        >
          現在地を表示
        </button>

        <FullscreenControl />

        {/* マップ操作コンポーネント */}
        <StopTrackingOnMove setOnTracking={setOnTracking} />
        <ChangeMapCenter position={currentPosition} onTracking={onTracking} />

        {/* マップレイヤー（マーカーやポリライン） */}
        <MapLayers
          course={course}
          items={items}
          currentPosition={currentPosition}
          heading={heading}
        />
      </MapContainer>
    </div>
  );
}

export default RouteMap;
