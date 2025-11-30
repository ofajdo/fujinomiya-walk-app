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
      zoom: 15,
    });

    mapRef.current = map;

    map.addControl(new NavigationControl(), "top-left");

    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
      showAccuracyCircle: true,
      fitBoundsOptions: {
        maxZoom: 28,
      },
    });

    map.addControl(new FullscreenControl(), "top-left");
    map.addControl(geolocate, "top-left");

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
