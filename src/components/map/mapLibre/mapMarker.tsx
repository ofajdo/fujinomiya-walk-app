/**
 * 円形のテキストマーカーを追加・管理する関数
 * @param map MapLibre GL マップインスタンス
 * @param markers マーカー設定の配列
 */
interface CircleMarker {
  id: string; // 一意のID
  position: [number, number]; // [lng, lat]
  text: string; // 表示する文字
  color: string; // 円の色
  onClick: () => void; // クリック時の関数
}
const MARKER_CONFIG = {
  size: 32,
  scale: 2,
  strokeWidth: 3,
  fontSize: 24,
  cornerRadius: 15,
  widthPerChar: 15, // 3文字以上の場合、1文字ごとに追加する幅
  horizontalPadding: 10, // 左右の余白
} as const;

/**
 * SVG画像を生成してマップに登録
 */ const createAndAddMarkerImage = (
  map: any,
  marker: CircleMarker,
  config = MARKER_CONFIG
) => {
  const imageId = `marker-${marker.id}`;

  // 既存の画像があれば削除
  if (map.hasImage(imageId)) {
    map.removeImage(imageId);
  }

  const scaledSize = config.size * config.scale;
  const textLength = marker.text.length;

  // 幅を計算（長方形の場合は幅が異なる）
  const width =
    textLength >= 3
      ? scaledSize + (textLength - 2) * config.widthPerChar
      : scaledSize;
  const height = scaledSize;

  const svg = generateMarkerSVG(marker, scaledSize, textLength, config);

  const encoded = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;

  const img = new Image(width, height); // ← ここを修正！
  img.src = dataUrl;
  img.onload = () => {
    map.addImage(imageId, img, { pixelRatio: config.scale });
  };
};

/**
 * マーカーのSVGを生成（円形または角丸長方形）
 */

const generateMarkerSVG = (
  marker: CircleMarker,
  scaledSize: number,
  textLength: number,
  config = MARKER_CONFIG
): string => {
  const {
    strokeWidth,
    fontSize,
    cornerRadius,
    widthPerChar,
    horizontalPadding,
  } = config;

  if (textLength >= 3) {
    // 長い文字列: 角丸長方形（左右にパディング追加）
    const rectWidth =
      scaledSize + (textLength - 2) * widthPerChar + horizontalPadding * 2;
    const rectHeight = scaledSize;

    return `
      <svg width="${rectWidth}" height="${rectHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect 
          x="${strokeWidth}" 
          y="${strokeWidth}" 
          width="${rectWidth - strokeWidth * 2}" 
          height="${rectHeight - strokeWidth * 2}" 
          rx="${cornerRadius}" 
          ry="${cornerRadius}" 
          fill="${marker.color}" 
          stroke="white" 
          stroke-width="${strokeWidth}"
        />
        <text 
          x="${rectWidth / 2}" 
          y="${rectHeight / 2}" 
          text-anchor="middle" 
          dominant-baseline="central" 
          font-size="${fontSize}" 
          font-weight="bold" 
          fill="white"
          font-family="-apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic UI', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif"
        >${marker.text}</text>
      </svg>
    `;
  } else {
    // 短い文字列: 円形
    const radius = scaledSize / 2 - strokeWidth;

    return `
      <svg width="${scaledSize}" height="${scaledSize}" xmlns="http://www.w3.org/2000/svg">
        <circle 
          cx="${scaledSize / 2}" 
          cy="${scaledSize / 2}" 
          r="${radius}" 
          fill="${marker.color}" 
          stroke="white" 
          stroke-width="${strokeWidth}"
        />
        <text 
          x="${scaledSize / 2}" 
          y="${scaledSize / 2}" 
          text-anchor="middle" 
          dominant-baseline="central" 
          font-size="${fontSize}" 
          font-weight="bold" 
          fill="white"
          font-family="-apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic UI', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif"
        >${marker.text}</text>
      </svg>
    `;
  }
};

/**
 * GeoJSONデータを生成
 */
const createGeoJSONData = (markers: CircleMarker[]) => ({
  type: "FeatureCollection" as const,
  features: markers.map((marker) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: marker.position,
    },
    properties: {
      id: marker.id,
    },
  })),
});

export const addCircleMarkers = (map: any, markers: CircleMarker[]) => {
  const sourceId = "circle-markers-source";
  const layerId = "circle-markers-layer";

  // SVG画像を生成して登録
  markers.forEach((marker) => {
    createAndAddMarkerImage(map, marker);
  });

  // GeoJSON データを作成
  const geojsonData = createGeoJSONData(markers);

  // 既存のレイヤーとソースがあれば削除
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }

  // ソースを追加
  map.addSource(sourceId, {
    type: "geojson",
    data: geojsonData,
  });

  // レイヤーを追加
  map.addLayer({
    id: layerId,
    type: "symbol",
    source: sourceId,
    layout: {
      "icon-image": ["concat", "marker-", ["get", "id"]],
      "icon-size": 1,
      "icon-allow-overlap": true,
    },
  });

  // クリックイベントを設定
  map.on("click", layerId, (e: any) => {
    if (e.features && e.features.length > 0) {
      const clickedId = e.features[0].properties.id;
      const marker = markers.find((m) => m.id === clickedId);
      if (marker) {
        marker.onClick();
      }
    }
  });

  // カーソルをポインターに変更
  map.on("mouseenter", layerId, () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", layerId, () => {
    map.getCanvas().style.cursor = "";
  });

  // 更新関数を返す
  return {
    update: (newMarkers: CircleMarker[]) => {
      // 新しいマーカーの画像を登録
      newMarkers.forEach((marker) => {
        createAndAddMarkerImage(map, marker);
      });

      // GeoJSON データを更新
      const newGeojsonData = createGeoJSONData(newMarkers);
      const source = map.getSource(sourceId);
      if (source) {
        source.setData(newGeojsonData);
      }
    },
  };
};
