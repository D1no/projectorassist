// browser/CornerControlPage.tsx

import React, {
  useState,
  useEffect,
  useRef,
  PointerEvent,
  CSSProperties,
} from "react";
import { socket } from "../lib/socket.ts";
import { Corners } from "#types/cornerTypes.ts";

// Our possible corner IDs:
type CornerKey = keyof Corners;

// Mapping from "precision mode" to how many percentage points we move per pixel:
const precisionMap = {
  full: 0.1, // Move 0.1% per 1px drag
  quarter: 0.02, // Move 0.02% per 1px drag
  detail: 0.01, // Move 0.01% per 1px drag
};
type PrecisionMode = keyof typeof precisionMap;

export function CornerControlPage() {
  // Store the corners from the server
  const [corners, setCorners] = useState<Corners>({
    topLeft: { x: 30, y: 5 },
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    bottomLeft: { x: 30, y: 95 },
  });

  // Which corner are we editing right now?
  const [selectedCorner, setSelectedCorner] = useState<CornerKey>("topLeft");

  // Precision mode
  const [precision, setPrecision] = useState<PrecisionMode>("full");

  // Keep track of pointer dragging
  const [isDragging, setIsDragging] = useState(false);
  // We'll store last pointer position so we can compute deltas
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);

  // For 30 FPS limiting, track the last time we sent to server
  const lastEmitTime = useRef<number>(0);

  useEffect(() => {
    // Listen for updates from the server
    function handleCornersUpdate(newCorners: Corners) {
      setCorners(newCorners);
    }
    socket.on("corners:update", handleCornersUpdate);

    return () => {
      socket.off("corners:update", handleCornersUpdate);
    };
  }, []);

  // Helper: Emit new corners at most ~30 fps
  function maybeEmitCorners(updated: Corners) {
    const now = performance.now();
    if (now - lastEmitTime.current > 1000 / 30) {
      // Enough time passed, so send
      socket.emit("corners:change", updated);
      lastEmitTime.current = now;
    }
  }

  // On pointer down in the "touchpad" area
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // Capture the pointer so we can get move events even if they move off the element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  }

  // On pointer move
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging || !lastPointerPos.current) return;

    // Compute drag delta in device px
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;

    // Update last pointer so subsequent moves are relative
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    // Convert device px -> % shift, based on the chosen precision

    // TODO: Fix ChatGPTs Type Errors here
    const factor = precisionMap[precision]; // e.g. 0.1 for 'full'
    // Negative dy means you moved up, so corner.y might decrease
    // We'll do corner.x += dx * factor, corner.y += dy * factor
    const updatedCorners: Corners = structuredClone(corners);

    // TODO: Fix ChatGPTs Type Errors here
    const cornerObj = updatedCorners[selectedCorner];
    cornerObj.x += dx * factor;
    cornerObj.y += dy * factor;

    // Clamp x/y to [0..100] so we don't go out of range
    cornerObj.x = Math.max(0, Math.min(100, cornerObj.x));
    cornerObj.y = Math.max(0, Math.min(100, cornerObj.y));

    // Locally update state
    setCorners(updatedCorners);

    // Emit to server, with 30fps limit
    maybeEmitCorners(updatedCorners);
  }

  // On pointer up
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastPointerPos.current = null;

    // Optionally do one final emit
    socket.emit("corners:change", corners);
  }

  // Basic styles
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    gap: 16,
    maxWidth: 400,
    margin: "0 auto",
  };

  const cornerSelectStyle: CSSProperties = {
    display: "flex",
    gap: 8,
  };

  const precisionSelectStyle: CSSProperties = {
    display: "flex",
    gap: 8,
  };

  // A "circular" touchpad ~200x200
  const touchpadStyle: CSSProperties = {
    width: 200,
    height: 200,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none", // Important for pointer events on touch devices
    userSelect: "none",
  };

  return (
    <div style={containerStyle}>
      <h1>Corner Control</h1>

      {/* Corner selection */}
      <div style={cornerSelectStyle}>
        {(
          ["topLeft", "topRight", "bottomRight", "bottomLeft"] as CornerKey[]
        ).map((ck) => (
          <button
            key={ck}
            style={{
              border:
                ck === selectedCorner ? "2px solid blue" : "1px solid gray",
              padding: "0.5rem 1rem",
            }}
            onClick={() => setSelectedCorner(ck)}
          >
            {ck}
          </button>
        ))}
      </div>

      {/* Touchpad */}
      <div
        style={touchpadStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        Drag here
      </div>

      {/* Precision selection */}
      <div style={precisionSelectStyle}>
        {(["full", "quarter", "detail"] as PrecisionMode[]).map((mode) => (
          <button
            key={mode}
            style={{
              border: mode === precision ? "2px solid blue" : "1px solid gray",
              padding: "0.5rem 1rem",
            }}
            onClick={() => setPrecision(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      <p>
        Currently adjusting: <strong>{selectedCorner}</strong>
      </p>
      <p>
        Precision: <strong>{precision}</strong>
      </p>
      <p>Corners state:</p>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(corners, null, 2)}</pre>
    </div>
  );
}
