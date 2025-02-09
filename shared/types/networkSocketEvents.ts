import type { CornersViewportCoordinates } from "./cornerTypes.ts";
import {
  ProjectionBackgroundColor,
  ProjectionOrientation,
} from "./projectionTypes.ts";

/**
 * URL and Port of the Websocket Server
 */
export const WEBSOCKET_SERVER_URL = "http://localhost:3001";

export const WEBSOCKET_PORT = 3001;

/**
 * Drop socket events client side that go above the following frames per second.
 */
export const THROTTELING_MAX_FPS = 30;

/**
 * Exclude Client-Side Socket Events from throttling (and beeing dropped) by the client if the event starts with the following string from `ClientToServerEvents`.
 */
export const THROTTELING_EXCLUDE = "action:";

// ==============================
// SERVER TO CLIENT EVENTS
// ==============================

/**
 * Interface representing the events sent from the server to the client.
 */
export interface ServerToClientEvents {
  "corners:update": (data: CornersViewportCoordinates) => void;
  // Add other events that the server sends to the client.
  "action:projection:background:update": (
    color: ProjectionBackgroundColor,
  ) => void;
  "action:projection:orientation:update": (
    orientation: ProjectionOrientation,
  ) => void;
}

// ==============================
// CLIENT TO SERVER EVENTS
// ==============================

/**
 * Interface representing the events sent from the client to the server.
 */
export interface ClientToServerEvents {
  "corners:change": (data: CornersViewportCoordinates) => void;
  // Excluded from throttle
  "action:projection:background:change": (
    color: ProjectionBackgroundColor,
  ) => void;
  "action:projection:orientation:change": (
    orientation: ProjectionOrientation,
  ) => void;
}
