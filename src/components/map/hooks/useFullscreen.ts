import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

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
