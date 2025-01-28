/**
 * Common types for corner pinning.
 * Used by both server (e.g. for websocket events) and client (React).
 */

export type Point = {
  x: number;
  y: number;
};

export type Corners = {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
};
