/**
 * PURPOSE:
 *   Provides a function `matrix3DForQuadToQuad` that takes two quads (each with 4 points)
 *   in 2D space and computes the CSS `matrix3d(...)` transform that maps the first quad
 *   onto the second. This is used for corner pinning (projective transformations) in React.
 *
 * USAGE:
 *   - Import the function into your React component or hook.
 *   - Pass a source quad (4 points: topLeft, topRight, bottomRight, bottomLeft) and
 *     a destination quad (where those corners should appear on-screen).
 *   - The function returns a string for CSS transforms, e.g. "matrix3d(...)".
 *
 * EXAMPLE:
 *   const transformStr = matrix3DForQuadToQuad(
 *     [ [0,0], [400,0], [400,300], [0,300] ],
 *     [ [10,10], [300,50], [350,250], [20,220] ]
 *   );
 *
 *   // Then apply it in your style:
 *   style={{ transform: transformStr, transformOrigin: '0 0' }}
 *
 * DEPENDENCIES:
 *   - This file also includes helper functions for solving linear systems
 *     and computing homography (projective) transformations.
 */

/**
 * Helper to build a 3D matrix for a 2D projective transform.
 *
 * - srcPts: 4 source points [[x0,y0],[x1,y0],[x2,y2],[x3,y3]]
 * - dstPts: 4 destination points (where those corners should map).
 *
 * Returns a string "matrix3d(...)" suitable for CSS transform.
 */
export function matrix3DForQuadToQuad(
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
