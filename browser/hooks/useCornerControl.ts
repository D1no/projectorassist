import { PointerEvent, useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket.ts";
import type { Corners } from "#types/cornerTypes.ts";

/** Our possible corner IDs: keys of the Corners type. */
export type CornerKey = keyof Corners;

/** Mapping from "precision mode" to how many percentage points we move per pixel. */
const precisionMap = {
  full: 0.1,
  quarter: 0.02,
  detail: 0.01,
} as const;
export type PrecisionMode = keyof typeof precisionMap;

/**
 * A custom React hook that manages corner data, pointer dragging,
 * precision selection, and real-time socket updates at ~30 FPS.
 */
export function useCornerControl() {
  // -----------------------
  // 1) STATE
  // -----------------------
  const [corners, setCorners] = useState<Corners>({
    topLeft: { x: 30, y: 5 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  });
  const [selectedCorner, setSelectedCorner] = useState<CornerKey>("topLeft");
  const [precision, setPrecision] = useState<PrecisionMode>("full");

  // For pointer dragging
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  // For 30 FPS limiting (socket emits)
  const lastEmitTime = useRef<number>(0);

  // -----------------------
  // 2) EFFECTS: Socket Listener
  // -----------------------
  useEffect(() => {
    const handleCornersUpdate = (newCorners: Corners) => {
      setCorners(newCorners);
    };
    socket.on("corners:update", handleCornersUpdate);

    return () => {
      socket.off("corners:update", handleCornersUpdate);
    };
  }, []);

  // -----------------------
  // 3) SOCKET EMIT THROTTLE
  // -----------------------
  function maybeEmitCorners(updated: Corners) {
    const now = performance.now();
    // Only emit if >= ~33ms since last emit (~30 FPS)
    if (now - lastEmitTime.current > 1000 / 30) {
      socket.emit("corners:change", updated);
      lastEmitTime.current = now;
    }
  }

  // -----------------------
  // 4) POINTER HANDLERS
  // -----------------------
  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging || !lastPointerPos.current) return;

    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;

    // Update last pointer so subsequent moves are relative
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    // Convert device px -> % shift, based on the chosen precision
    const factor = precisionMap[precision as keyof typeof precisionMap];

    // Clone corners so we can mutate
    const updatedCorners = structuredClone(corners) as Corners;
    const cornerObj = updatedCorners[selectedCorner as CornerKey];

    // Nudge x/y
    cornerObj.x += dx * factor;
    cornerObj.y += dy * factor;

    // Clamp within [0..100]
    cornerObj.x = Math.max(0, Math.min(100, cornerObj.x));
    cornerObj.y = Math.max(0, Math.min(100, cornerObj.y));

    // Update local state
    setCorners(updatedCorners);

    // Throttled emit
    maybeEmitCorners(updatedCorners);
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastPointerPos.current = null;

    // Optionally do one final emit
    socket.emit("corners:change", corners);
  }

  // -----------------------
  // 5) ACTIONS: Select Corner / Precision
  // -----------------------
  function handleCornerSelect(cornerKey: CornerKey) {
    setSelectedCorner(cornerKey);
  }

  function handlePrecisionSelect(mode: PrecisionMode) {
    setPrecision(mode);
  }

  // -----------------------
  // 6) RETURN HOOK API
  // -----------------------
  return {
    corners,
    selectedCorner,
    precision,
    isDragging,
    handleCornerSelect,
    handlePrecisionSelect,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
