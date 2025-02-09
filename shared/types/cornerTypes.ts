/**
 * Common types for corner pinning.
 * Used by both server (e.g. for websocket events) and client (React).
 */

import { ProjectionOrientation } from "./projectionTypes.ts";

export type Point = {
  x: number;
  y: number;
};

/**
 * The four corners of the keystone as it is rendered on the viewport.
 */
export type CornersViewportCoordinates = {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
};

/**
 * Depending on the projector orientation, mapping the viewport corners to user perspective.
 */
export type MappingCornersUserPerspective = {
  [Orientation in ProjectionOrientation]: {
    [Corner in keyof CornersViewportCoordinates]:
      keyof CornersViewportCoordinates;
  };
};

/**
 * Aisgnment of the corners in user perspective based on the projector orientation. Used for aligning the corners in the UI from the user perspective.
 */
export const mappingCornersUserPerspective: MappingCornersUserPerspective = {
  Landscape: {
    topLeft: "topLeft",
    topRight: "topRight",
    bottomRight: "bottomRight",
    bottomLeft: "bottomLeft",
  },
  LandscapeInverted: {
    topLeft: "bottomLeft",
    topRight: "bottomRight",
    bottomRight: "topRight",
    bottomLeft: "topLeft",
  },
  Portrait: {
    topLeft: "topRight",
    topRight: "bottomRight",
    bottomRight: "bottomLeft",
    bottomLeft: "topLeft",
  },
  PortraitInverted: {
    topLeft: "bottomRight",
    topRight: "bottomLeft",
    bottomRight: "topLeft",
    bottomLeft: "topRight",
  },
} as const;

export type CornerAsignmentFromUserPerspective = {
  [Corner in keyof CornersViewportCoordinates]:
    keyof CornersViewportCoordinates;
};

/**
 * Get the corner asignment from the user perspective based on the projector orientation. Example: If the projector is in in portrait orientation, the corner asignment from the user perspective is:
 * ```
 * {
 *  topLeft: "topRight",
 *  topRight: "bottomRight",
 *  bottomRight: "bottomLeft",
 *  bottomLeft: "topLeft",
 * }
 * ```
 */
export function getCornerAsignmentFromUserPerspective(
  orientation: ProjectionOrientation,
): CornerAsignmentFromUserPerspective {
  return mappingCornersUserPerspective[orientation];
}
