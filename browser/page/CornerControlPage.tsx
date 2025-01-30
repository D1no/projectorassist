import { CSSProperties } from "react";
import {
  useCornerControl,
  CornerKey,
  PrecisionMode,
} from "../hooks/useCornerControl.ts";

/**
 * A presentational component that uses the `useCornerControl` hook
 * to render a corner calibration interface with a circular "touchpad".
 */
export function CornerControlPage() {
  // Use our custom hook to get state & handlers
  const {
    corners,
    selectedCorner,
    precision,
    handleCornerSelect,
    handlePrecisionSelect,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCornerControl();

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
            onClick={() => handleCornerSelect(ck)}
          >
            {ck}
          </button>
        ))}
      </div>

      {/* Touchpad */}
      <div
        style={touchpadStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
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
            onClick={() => handlePrecisionSelect(mode)}
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
