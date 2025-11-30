"use client";

import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

export function useGeolocation() {
  const [onTracking, setOnTracking] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startGeolocation = () => {
    setOnTracking(true);
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報取得に対応していません。");
      setOnTracking(false);
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("位置情報取得失敗:", err);
        alert("現在地の取得に失敗しました。");
        setOnTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
    setWatchId(id);
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { onTracking, setOnTracking, currentPosition, startGeolocation };
}
