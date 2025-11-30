"use client";

import React, { useState, useEffect, useRef } from "react";
import { Marker, Polyline, useMap, useMapEvents } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

// 地図操作で追跡解除
export function StopTrackingOnMove({
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

// 地図の中心を動的に追従
export function ChangeMapCenter({
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

// 矢印アイコン
export const arrowIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" class="h-[12px] w-[12px]" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="none"/><g fill="currentColor"><path d="M9.5 1.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906l.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154l-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613l-.435.489l-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/><path d="M6.25 11.745v-1.418l1.204 1.375l.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215l-.494-.494l.205-1.843l.006-.067l1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/></g></svg>`,
  className:
    "text-white bg-blue-600 p-[4px] rounded-full transition-all duration-[1s]",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// 動くマーカー（経路表示アニメ）
export function MovingMarker({
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

  if (!route.length) return null;
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

export const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    const control = (L as any).control.fullscreen({
      position: "topleft",
      // 必要に応じてオプション
    });
    control.addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};
