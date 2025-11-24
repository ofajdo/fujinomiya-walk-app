"use client";

import { useState, useEffect } from "react";

export function useOrientation() {
  const [heading, setHeading] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(true); // ボタンの無効化フラグ

  // 方位センサー開始
  const startOrientation = () => {
    const handleOrientation = (
      e: DeviceOrientationEvent & { webkitCompassHeading?: number }
    ) => {
      if (e.webkitCompassHeading !== undefined) {
        // ✅ iOS北基準
        setHeading(e.webkitCompassHeading);
      } else if (e.absolute && e.alpha !== null) {
        // ✅ Android北基準
        setHeading(360 - e.alpha);
      } else if (e.alpha !== null) {
        // ⚙ フォールバック（相対値）
        setHeading(360 - e.alpha);
      }
    };

    const win = window as unknown as Window;
    if ("ondeviceorientationabsolute" in win) {
      (win as Window).addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    } else {
      (win as Window).addEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    }
  };

  // iOS用 権限リクエスト
  const requestPermission = () => {
    setIsDisabled(true); // 押下後にボタンを無効化
    if ("requestPermission" in DeviceOrientationEvent) {
      (DeviceOrientationEvent.requestPermission as () => Promise<string>)()
        .then((res: string) => {
          if (res === "granted") startOrientation();
          else alert("方向センサーの使用が許可されませんでした。");
        })
        .catch(() => alert("方向センサーの権限リクエストに失敗しました。"));
    } else {
      // iOS以外、または権限不要のブラウザ
      startOrientation();
    }
  };

  // UA判定 (最初に一度だけ実行)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    if (
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && "ontouchend" in document) ||
      /Android/.test(ua)
    ) {
      setIsDisabled(false); // iOS/Androidならボタンを有効化
    }

    // クリーンアップ
    return () => {
      window.removeEventListener("deviceorientation", () => {});
      window.removeEventListener("deviceorientationabsolute", () => {});
    };
  }, []);

  return { heading, isDisabled, requestPermission };
}
