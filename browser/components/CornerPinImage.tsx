import styled from "@emotion/styled";
import { useWindowSize } from "../hooks/useWindowSize.ts";
import { matrix3DForQuadToQuad } from "#lib/matrix3DForQuadToQuad.tsx";

import type { CornersViewportCoordinates } from "#types/cornerTypes.ts";

/**
 * PURPOSE:
 *   A reusable React component that "corner-pins" (projective transforms)
 *   an image onto 4 specified corners in the browser globalThis.
 *
 * USAGE:
 *   - Import <CornerPinImage /> and render it with props:
 *       src, corners, srcWidth, srcHeight, (optional) backgroundColor
 *   - The 'corners' prop specifies topLeft, topRight, bottomRight,
 *     bottomLeft in percentage coordinates of the viewport (0 to 100).
 *
 * EXAMPLE:
 *   <CornerPinImage
 *     src="/myImage.png"
 *     srcWidth={1366}
 *     srcHeight={1024}
 *     corners={{
 *       topLeft: { x: 10, y: 10 },
 *       topRight: { x: 90, y: 10 },
 *       bottomRight: { x: 90, y: 90 },
 *       bottomLeft: { x: 10, y: 90 },
 *     }}
 *     backgroundColor="#cccccc"
 *   />
 *
 * DEPENDENCIES:
 *   - React (plus a custom useWindowSize hook).
 *   - matrix3DForQuadToQuad.ts for computing the CSS transform.
 */

interface CornerPinImageProps {
  /** The image source URL or import. */
  src: string;
  /** The corners in percentages of the viewport (0-100). */
  corners: CornersViewportCoordinates;
  /** The original (untransformed) width of the image. */
  srcWidth: number;
  /** The original (untransformed) height of the image. */
  srcHeight: number;
  /** The background color for the container. Default: "#8d8d8d". */
  backgroundColor?: string;
}

interface ContainerProps {
  backgroundColor: string;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.backgroundColor};
`;

interface PinnedImageProps {
  srcWidth: number;
  srcHeight: number;
  transform: string;
}

const PinnedImage = styled.img<PinnedImageProps>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => props.srcWidth}px;
  height: ${(props) => props.srcHeight}px;
  transform-origin: 0 0;
  transform: ${(props) => props.transform};
`;

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

  // Source quad: the untransformed bounding box of the image
  const srcQuad: [number, number][] = [
    [0, 0],
    [srcWidth, 0],
    [srcWidth, srcHeight],
    [0, srcHeight],
  ];

  // Compute the projective transform
  const transformStr = matrix3DForQuadToQuad(srcQuad, dstQuad);

  return (
    <Container backgroundColor={backgroundColor}>
      <PinnedImage
        src={src}
        srcWidth={srcWidth}
        srcHeight={srcHeight}
        transform={transformStr}
        alt="Corner-pinned projection"
      />
    </Container>
  );
}
