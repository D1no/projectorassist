import React, { useState, useEffect } from "react";
import alignmentImage from "./projections/projector_ipad_alignment_portrait.png";
import "./App.css";

/**
 * Helper to build a 3D matrix for a 2D projective transform.
 *
 * - srcPts: 4 source points [[x0,y0],[x1,y0],[x2,y2],[x3,y3]]
 * - dstPts: 4 destination points (where those corners should map).
 *
 * Returns a string "matrix3d(...)" suitable for CSS transform.
 */
function matrix3DForQuadToQuad(
  srcPts: [number, number][],
  dstPts: [number, number][]
): string {
  /*
    Projective transforms in 2D can be represented by an 3x3 matrix H,
    but in CSS we use a 4x4 matrix. The math to solve for H can be found
    in many references (homography). Then we embed H into a 4x4.
    
    For brevity, here’s a compact approach adapted from an answer by
    @gman on StackOverflow (with minor modifications) that directly
    returns the 4x4 in column-major order for `matrix3d(...)`.
  */

  const [x0, y0] = srcPts[0];
  const [x1, y1] = srcPts[1];
  const [x2, y2] = srcPts[2];
  const [x3, y3] = srcPts[3];

  const [X0, Y0] = dstPts[0];
  const [X1, Y1] = dstPts[1];
  const [X2, Y2] = dstPts[2];
  const [X3, Y3] = dstPts[3];

  const srcMatrix = solve2DProjection(
    x0,
    y0,
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    X0,
    Y0,
    X1,
    Y1,
    X2,
    Y2,
    X3,
    Y3
  );

  // Format into matrix3d string:
  const m = srcMatrix;
  const matrix3d = [
    m[0],
    m[3],
    0,
    m[6],
    m[1],
    m[4],
    0,
    m[7],
    0,
    0,
    1,
    0,
    m[2],
    m[5],
    0,
    m[8],
  ];

  return "matrix3d(" + matrix3d.join(",") + ")";
}

/**
 * Solve for the 3x3 homography matrix that maps (x0,y0)->(X0,Y0), etc.
 * Returns [a, b, c, d, e, f, g, h, i].
 *
 * Implementation detail from:
 *   https://math.stackexchange.com/questions/2220972/3d-2d-homography
 * or
 *   https://stackoverflow.com/a/13970690/190862
 */
function solve2DProjection(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  X0: number,
  Y0: number,
  X1: number,
  Y1: number,
  X2: number,
  Y2: number,
  X3: number,
  Y3: number
) {
  const A = [
    [x0, y0, 1, 0, 0, 0, -X0 * x0, -X0 * y0],
    [0, 0, 0, x0, y0, 1, -Y0 * x0, -Y0 * y0],

    [x1, y1, 1, 0, 0, 0, -X1 * x1, -X1 * y1],
    [0, 0, 0, x1, y1, 1, -Y1 * x1, -Y1 * y1],

    [x2, y2, 1, 0, 0, 0, -X2 * x2, -X2 * y2],
    [0, 0, 0, x2, y2, 1, -Y2 * x2, -Y2 * y2],

    [x3, y3, 1, 0, 0, 0, -X3 * x3, -X3 * y3],
    [0, 0, 0, x3, y3, 1, -Y3 * x3, -Y3 * y3],
  ];

  const B = [X0, Y0, X1, Y1, X2, Y2, X3, Y3];
  const h = solveLinearSystem(A, B); // h = [a,b,c,d,e,f,g,h]

  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

/**
 * Solve A*x = B for x[], using naive Gaussian elimination.
 * A is 8x8, B is length=8. (We keep it minimal for demonstration.)
 */
function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = A.length; // 8
  // augment A with B
  for (let i = 0; i < n; i++) {
    A[i].push(B[i]);
  }

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    // pivot
    let pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) {
      // If pivot is too small, swap with a row below that has a bigger pivot
      for (let r = i + 1; r < n; r++) {
        if (Math.abs(A[r][i]) > Math.abs(pivot)) {
          [A[i], A[r]] = [A[r], A[i]];
          pivot = A[i][i];
          break;
        }
      }
    }
    // normalize pivot row
    for (let c = i; c < n + 1; c++) {
      A[i][c] = A[i][c] / pivot;
    }
    // eliminate below
    for (let r = i + 1; r < n; r++) {
      const f = A[r][i];
      for (let c = i; c < n + 1; c++) {
        A[r][c] -= f * A[i][c];
      }
    }
  }
  // back-substitution
  for (let i = n - 1; i >= 0; i--) {
    let val = A[i][n];
    for (let c = i + 1; c < n; c++) {
      val -= A[i][c] * A[c][n];
    }
    A[i][n] = val / A[i][i];
  }

  return A.map((row) => row[n]);
}

function App() {
  // The four corners *on the projector screen* (in percentages),
  // where the rotated iPad image corners should land.
  // Tweak these to adjust alignment.
  const corners = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 100, y: 0 },
    bottomRight: { x: 100, y: 100 },
    bottomLeft: { x: 0, y: 100 },
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
