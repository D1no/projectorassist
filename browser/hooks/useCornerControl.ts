import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import socket from "../lib/socket.ts";
import {
  type CornersViewportCoordinates,
  getCornersMappingUserPerspectiveToViewport,
  translateAxisDirectionUserPerspectiveToViewport,
} from "#types/cornerTypes.ts";
import { useProjectionOrientation } from "./useProjectionOrientation.ts";

// TODO: This huge hook needs to be split into smaller hooks.

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
 *
 * It differentiates between the corner the user selects (user perspective)
 * and the actual viewport corner that should be updated.
 */
export function useCornerControl() {
  const { orientation } = useProjectionOrientation();

  // Recompute the mapping whenever the orientation changes.
  const cornerMapping = useMemo(
    () => getCornersMappingUserPerspectiveToViewport(orientation),
    [orientation],
  );

  // -----------------------
  // 1) STATE
  // -----------------------
  // Holds the actual viewport corner coordinates.
  const [cornersViewport, setViewportCorners] = useState(
    initialCornerCordinates,
  );
  // Holds the corner selected on the phone (from the user's perspective).
  const [selectedCornerUserPerspective, setSelectedCorner] = useState<
    CornerKey
  >("topLeft");
  const [precision, setPrecision] = useState<PrecisionMode>("full");

  // For pointer dragging
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  // -----------------------
  // 2) EFFECTS: Socket Listener
  // -----------------------
  useEffect(() => {
    const handleCornersUpdate = (newCorners: CornersViewportCoordinates) => {
      setViewportCorners(newCorners);
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
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    const factor = precisionMap[precision];

    // Clone the current corners for mutation.
    const updatedViewportCorners = structuredClone(
      cornersViewport,
    ) as CornersViewportCoordinates;

    // Apply the mapping: translate the user-selected corner to the actual viewport corner.
    const viewportCornerKey: CornerKey =
      cornerMapping[selectedCornerUserPerspective];

    // Get the corner object from the cloned corners.
    const cornerObj = updatedViewportCorners[viewportCornerKey];

    // Translate the pointer delta (dx, dy) from user perspective to viewport.
    const { x, y } = translateAxisDirectionUserPerspectiveToViewport
      [orientation](dx, dy);

    // Update the coordinates.
    cornerObj.x = Math.max(0, Math.min(100, cornerObj.x + x * factor));
    cornerObj.y = Math.max(0, Math.min(100, cornerObj.y + y * factor));

    setViewportCorners(updatedViewportCorners);
    socket.emit("corners:change", updatedViewportCorners);
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastPointerPos.current = null;
    socket.emit("corners:change", cornersViewport);
  }

  // -----------------------
  // 4) ACTIONS: Select Corner / Precision
  // -----------------------
  function handleCornerUserPerspectiveSelect(cornerKey: CornerKey) {
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
    selectedCornerUserPerspective,
    precision,
    isDragging,
    handleCornerUserPerspectiveSelect,
    handlePrecisionSelect,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
