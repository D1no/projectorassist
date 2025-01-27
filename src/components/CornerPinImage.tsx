import React, { CSSProperties } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { matrix3DForQuadToQuad } from "../lib/matrix3DForQuadToQuad";

type Point = { x: number; y: number };

type Corners = {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
};

interface CornerPinImageProps {
  /** The image source URL or import. */
  src: string;
  /** The corners in percentages of the viewport (0-100). */
  corners: Corners;
  /** The original (untransformed) width of the image. */
  srcWidth: number;
  /** The original (untransformed) height of the image. */
  srcHeight: number;
  /** The background color for the container. Default: "#8d8d8d". */
  backgroundColor?: string;
}

/**
 * Renders a full-page container with a corner-pinned image.
 * The image is placed at (0,0) in its natural size (srcWidth x srcHeight),
 * then transformed so that each corner lines up with the given `corners`.
 */
export function CornerPinImage({
  src,
  corners,
  srcWidth,
  srcHeight,
  backgroundColor = "#8d8d8d",
}: CornerPinImageProps) {
  const windowSize = useWindowSize();

  // Convert a corner in % to an actual (x,y) in pixels
  const xPx = (pct: number) => (pct / 100) * windowSize.width;
  const yPx = (pct: number) => (pct / 100) * windowSize.height;

  // Destination quad: topLeft -> topRight -> bottomRight -> bottomLeft
  const dstQuad: [number, number][] = [
    [xPx(corners.topLeft.x), yPx(corners.topLeft.y)],
    [xPx(corners.topRight.x), yPx(corners.topRight.y)],
    [xPx(corners.bottomRight.x), yPx(corners.bottomRight.y)],
    [xPx(corners.bottomLeft.x), yPx(corners.bottomLeft.y)],
  ];

  // Source quad: the untransformed bounding box of the image.
  // For example, if you previously rotated the asset externally
  // so that it is 1366x1024 in "landscape", then:
  //   (0,0) -> (srcWidth,0) -> (srcWidth,srcHeight) -> (0,srcHeight)
  const srcQuad: [number, number][] = [
    [0, 0],
    [srcWidth, 0],
    [srcWidth, srcHeight],
    [0, srcHeight],
  ];

  // Compute the matrix for corner-pinning
  const transformStr = matrix3DForQuadToQuad(srcQuad, dstQuad);

  // Styles:
  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor,
  };

  const imgStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: srcWidth,
    height: srcHeight,
    transformOrigin: "0 0",
    transform: transformStr,
  };

  return (
    <div style={containerStyle}>
      <img src={src} style={imgStyle} alt="Corner-pinned projection" />
    </div>
  );
}
