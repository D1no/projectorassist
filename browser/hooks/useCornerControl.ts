import { PointerEvent, useEffect, useRef, useState } from "react";
import socket from "../lib/socket.ts";
import {
  type CornersViewportCoordinates,
  getCornerAsignmentFromUserPerspective,
  translateAxisDirectionUserPerspectiveToViewport,
} from "#types/cornerTypes.ts";
import { useProjectionOrientation } from "./useProjectionOrientation.ts";

const initialCornerCordinates: CornersViewportCoordinates = {
  topLeft: { x: 30, y: 5 },
  topRight: { x: 90, y: 5 },
  bottomRight: { x: 90, y: 95 },
  bottomLeft: { x: 30, y: 95 },
};

/** Our possible corner IDs: keys of the Corners type. */
export type CornerKey = keyof CornersViewportCoordinates;

/** Mapping from "precision mode" to how many percentage points we move per pixel. */
const precisionMap = {
  full: 0.1,
  quarter: 0.02,
  detail: 0.01,
} as const;
export type PrecisionMode = keyof typeof precisionMap;

/**
 * A custom React hook that manages corner data, pointer dragging,
 * precision selection, and real-time socket updates.
 */
export function useCornerControl() {
  const { orientation } = useProjectionOrientation();

  // Compute the mapping from user perspective to actual viewport coordinates.
  // For example, if the projector is in Portrait mode, this mapping might be:
  // { topLeft: "topRight", topRight: "bottomRight", bottomRight: "bottomLeft", bottomLeft: "topLeft" }
  const cornerMapping = getCornerAsignmentFromUserPerspective(orientation);

  // -----------------------
  // 1) STATE
  // -----------------------
  const [cornersViewport, setCorners] = useState(initialCornerCordinates);
  const [selectedCorner, setSelectedCorner] = useState<CornerKey>("topLeft");
  const [precision, setPrecision] = useState<PrecisionMode>("full");

  // For pointer dragging
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  // -----------------------
  // 2) EFFECTS: Socket Listener
  // -----------------------
  useEffect(() => {
    const handleCornersUpdate = (newCorners: CornersViewportCoordinates) => {
      setCorners(newCorners);
    };
    socket.on("corners:update", handleCornersUpdate);

    return () => {
      socket.off("corners:update", handleCornersUpdate);
    };
  }, []);

  // -----------------------
  // 3) POINTER HANDLERS
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

    // Convert device pixels to percentage shifts, based on the chosen precision
    const factor = precisionMap[precision as keyof typeof precisionMap];

    // Clone corners so we can mutate them safely
    const updatedCorners = structuredClone(
      cornersViewport,
    ) as CornersViewportCoordinates;
    const cornerObj = updatedCorners[selectedCorner as CornerKey];

    // Translate the users delta movement on the touchpad to the viewport
    const { x, y } = translateAxisDirectionUserPerspectiveToViewport
      [orientation](dx, dy);

    // Nudge x/y
    cornerObj.x += x * factor;
    cornerObj.y += y * factor;

    // Clamp within [0..100]
    cornerObj.x = Math.max(0, Math.min(100, cornerObj.x));
    cornerObj.y = Math.max(0, Math.min(100, cornerObj.y));

    // Update local state
    setCorners(updatedCorners);

    // Emit new corners (global throttling in socket.ts applies)
    socket.emit("corners:change", updatedCorners);
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastPointerPos.current = null;

    // Final emit (subject to global throttle)
    socket.emit("corners:change", cornersViewport);
  }

  // -----------------------
  // 4) ACTIONS: Select Corner / Precision
  // -----------------------
  function handleCornerSelect(cornerKey: CornerKey) {
    setSelectedCorner(cornerKey);
  }

  function handlePrecisionSelect(mode: PrecisionMode) {
    setPrecision(mode);
  }

  // -----------------------
  // 5) RETURN HOOK API
  // -----------------------
  return {
    cornersViewport,
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
