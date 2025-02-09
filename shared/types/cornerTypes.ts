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
    topLeft: "bottomLeft",
    topRight: "topLeft",
    bottomRight: "topRight",
    bottomLeft: "bottomRight",
  },
} as const;

type CornerToCornerMapping = {
  [Corner in keyof CornersViewportCoordinates]:
    keyof CornersViewportCoordinates;
};

/**
 * Get the corner assignment from the viewport to the user perspective.
 * In other words, given the projector orientation, this mapping tells you
 * what the viewport's "topLeft" should be called on the user’s controller device.
 *
 * Example: For portrait orientation:
 * {
 *  topLeft: "topRight",
 *  topRight: "bottomRight",
 *  bottomRight: "bottomLeft",
 *  bottomLeft: "topLeft",
 * }
 */
export function getCornersMappingViewportToUserPerspective(
  orientation: ProjectionOrientation,
): CornerToCornerMapping {
  return mappingCornersUserPerspective[orientation];
}

/**
 * Get the corner assignment from the user perspective to the viewport.
 * This is simply the reverse mapping of `getCornersMappingViewportToUserPerspective`.
 * For example, if the projector is in portrait orientation, the "topRight" corner on
 * the user's device corresponds to the "topLeft" corner in the viewport.
 */
export function getCornersMappingUserPerspectiveToViewport(
  orientation: ProjectionOrientation,
): CornerToCornerMapping {
  const mapping = getCornersMappingViewportToUserPerspective(orientation);
  const reverseMapping: CornerToCornerMapping = {} as CornerToCornerMapping;
  for (
    const [viewportCorner, userPerspectiveCorner] of Object.entries(mapping)
  ) {
    reverseMapping[userPerspectiveCorner] =
      viewportCorner as keyof CornersViewportCoordinates;
  }
  return reverseMapping;
}

type translateAxisDirectionUserPerspectiveToViewport = {
  [Orientation in ProjectionOrientation]: (
    x: number,
    y: number,
  ) => Point;
};

/**
 * Translate the axis direction from the user perspective to the viewport based on the projector orientation. Important for nudging the corners in the UI.
 */
export const translateAxisDirectionUserPerspectiveToViewport = {
  Landscape: (x: number, y: number) => ({ x, y }),
  LandscapeInverted: (x: number, y: number) => ({ x: x * -1, y: y * -1 }),
  Portrait: (x: number, y: number) => ({ x: y, y: x * -1 }),
  PortraitInverted: (x: number, y: number) => ({ x: y * -1, y: x }),
} as const;
