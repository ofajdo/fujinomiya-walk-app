"use client";

import { ReactNode, useEffect, useRef } from "react";
import maplibregl, {
  Map as MapLibreMap,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  LngLatLike,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Prisma } from "@prisma/client";

import { CompassControl } from "maplibre-gl-compass";
import "maplibre-gl-compass/style.css";
import { toLngLat } from "../CourseMap";

type Course = Prisma.CourseGetPayload<{
  include: {
    startingPoint: {
      include: {
        place: true;
      };
    };
    routes: true;
    points: {
      include: {
        point: true;
      };
    };
    locations: {
      include: {
        course: true;
        place: true;
      };
    };
  };
}>;

export const MapClient = ({
  center,
  contents,
  course,
}: {
  center: LngLatLike;
  contents: (mapData: MapLibreMap) => void | (() => void); // 型を明示
  course: Course;
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        "https://api.maptiler.com/maps/base-v4/style.json?key=ylcgFCpLu3EKnFshv302",
      center: center,
      zoom: 14,
    });

    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }), "top-left");

    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
      showAccuracyCircle: true,
      fitBoundsOptions: {
        maxZoom: 17,
      },
    });
    const compass = new CompassControl();

    map.addControl(new FullscreenControl(), "top-left");
    map.addControl(geolocate, "top-left");
    map.addControl(compass, "top-left");

    compass.on("turnon", () => {
      // コンパスを押したときに、ジオロケーションを有効にする
      if (geolocate._watchState !== "ACTIVE_LOCK") {
        geolocate.trigger();
      }
    });
    geolocate.on("userlocationlostfocus", () => {
      // NOTE: コンパスが向きを設定 (setBearing) すると自動トラッキングが OFF になるため、ユーザー操作でない変更時は再度 ON にする
      if (!isOperating) {
        geolocate.trigger();
      }
    });

    // STEP3: 上記の userlocationlostfocus が発火した時、ユーザー操作起因かどうかを判断するためのフラグを管理する
    let isOperating = false;
    map.on("touchstart", () => (isOperating = true));
    map.on("touchend", () => (isOperating = false));

    map.on("load", () => {
      // contentsの戻り値（クリーンアップ関数）を保存
      const cleanup = contents(map);
      if (typeof cleanup === "function") {
        cleanupRef.current = cleanup;
      }
    });

    return () => {
      // クリーンアップ関数を実行
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [center, course]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default MapClient;
