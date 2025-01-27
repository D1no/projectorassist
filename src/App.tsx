import React, { useState, useEffect } from "react";
import alignmentImage from "./projections/projector_ipad_alignment_portrait.png";
import "./App.css";
import { matrix3DForQuadToQuad } from "./lib/matrix3DForQuadToQuad";

function App() {
  // The four corners *on the projector screen* (in percentages),
  // where the rotated iPad image corners should land.
  // Tweak these to adjust alignment.
  const corners = {
    topRight: { x: 90, y: 5 },
    bottomRight: { x: 90, y: 95 },
    topLeft: { x: 30, y: 5 },
    bottomLeft: { x: 23, y: 95 },
  };

  // We'll measure the actual window size to convert percentages → pixels
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Convert the "corner in % of window" to actual pixel coords
  const xPx = (pct: number) => (pct / 100) * windowSize.width;
  const yPx = (pct: number) => (pct / 100) * windowSize.height;

  const dstQuad: [number, number][] = [
    [xPx(corners.topLeft.x), yPx(corners.topLeft.y)],
    [xPx(corners.topRight.x), yPx(corners.topRight.y)],
    [xPx(corners.bottomRight.x), yPx(corners.bottomRight.y)],
    [xPx(corners.bottomLeft.x), yPx(corners.bottomLeft.y)],
  ];

  // The "source" quad after –90° rotation about top-left:
  // (width=1366, height=1024), corners are:
  //   (0,0) → top-left
  //   (1366,0) → top-right
  //   (1366,1024) → bottom-right
  //   (0,1024) → bottom-left
  const srcQuad: [number, number][] = [
    [0, 0],
    [1366, 0],
    [1366, 1024],
    [0, 1024],
  ];

  // Compute CSS matrix3d
  const transformStr = matrix3DForQuadToQuad(srcQuad, dstQuad);

  // We'll absolutely position the image at (0,0) with its "natural" size
  // (1366x1024). Then apply the corner-pin transform so it lands in the
  // desired quad on screen.
  const imgStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: 1366,
    height: 1024,
    transformOrigin: "0 0",
    transform: transformStr,
    // The grey background is on the parent container, so the image
    // itself can be fully transparent outside of its own bounding box.
  };

  return (
    <div id="app-container">
      <img src={alignmentImage} alt="Rotated iPad alignment" style={imgStyle} />
    </div>
  );
}

export default App;
