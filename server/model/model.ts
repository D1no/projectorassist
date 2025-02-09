import type { CornersViewportCoordinates } from "#types/cornerTypes.ts";
import type {
  ProjectionBackgroundColor,
  ProjectionOrientation,
} from "#types/projectionTypes.ts";

/**
 * Allowed schema versions for the data model.
 */
export type ModelSchemaVersion = "0.1.0" | "0.1.1";

/**
 * The shape of the global data model to persist state.
 */
export interface DataModel {
  schemaVersion: ModelSchemaVersion;
  projection: {
    orientation: ProjectionOrientation;
    backgroundColor: ProjectionBackgroundColor;
  };
  corners: CornersViewportCoordinates;
  slides: {
    currentSlide: number;
  };
}
