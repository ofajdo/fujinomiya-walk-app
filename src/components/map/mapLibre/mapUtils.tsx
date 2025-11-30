"use client";
import { Prisma } from "@prisma/client";

type LocationWithPlace = Prisma.LocationGetPayload<{
  include: {
    place: true;
  };
}>;
export const CourseLines = ({
  map,
  route,
}: {
  map: any;
  route: number[][];
}) => {
  // 既存のソースがあれば削除
  if (map.getSource("courseRoute")) {
    if (map.getLayer("route")) {
      map.removeLayer("route");
    }
    map.removeSource("courseRoute");
  }

  map.addSource("courseRoute", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route,
      },
      properties: {},
    },
  });

  map.addLayer({
    id: "route",
    type: "line",
    source: "courseRoute",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#00F",
      "line-width": 3,
      "line-dasharray": [0, 4, 3],
    },
  });

  // 破線アニメーションのシーケンス
  const dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5],
  ];

  let step = 0;
  let animationFrameId: number | null = null;

  // アロー関数を使ってmapのスコープを維持
  const animateDashArray = (timestamp: number) => {
    // マップとレイヤーの存在確認
    if (!map || !map.getLayer || !map.getLayer("route")) {
      return;
    }

    const newStep = Math.floor((timestamp / 50) % dashArraySequence.length);

    if (newStep !== step) {
      map.setPaintProperty(
        "route",
        "line-dasharray",
        dashArraySequence[newStep]
      );
      step = newStep;
    }

    animationFrameId = requestAnimationFrame(animateDashArray);
  };

  // アニメーション開始
  animationFrameId = requestAnimationFrame(animateDashArray);

  // クリーンアップ関数を返す
  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};
