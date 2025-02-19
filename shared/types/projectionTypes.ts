/**
 * Background color of the video projector.
 */
export enum ProjectionBackgroundColor {
  /**
   * The background is invisible as the video projector can not project black.
   */
  Invisible = "#000000",
  /**
   * Full visibility background color.
   */
  Visible = "#ffffff",
  /**
   * The background color used when aligning the projected image.
   */
  Align = "#FF13F0", // Neon Pink
}

/**
 * Orientation of the video projector.
 */
export enum ProjectionOrientation {
  /**
   * The video projector is in a default landscape orientation.
   */
  Landscape = "Landscape",
  /**
   * The video projector is in an inverted landscape orientation.
   */
  LandscapeInverted = "LandscapeInverted",
  /**
   * The video projector is in portrait orientation.
   */
  Portrait = "Portrait",
  /**
   * The video projector is in an inverted portrait orientation.
   */
  PortraitInverted = "PortraitInverted",
}

/**
 * If the image projection is visible or not.
 */
export type ProjectionVisible = boolean;

/**
 * If the keystone should be active or not.
 */
export type ProjectionKeystoneActive = boolean;
