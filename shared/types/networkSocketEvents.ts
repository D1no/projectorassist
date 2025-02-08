import type { Corners } from "./cornerTypes.ts";

// ==============================
// SERVER TO CLIENT EVENTS
// ==============================

export const WEBSOCKET_PORT = 3001;

/**
 * Interface representing the events sent from the server to the client.
 */
export interface ServerToClientEvents {
  "corners:update": (data: Corners) => void;
  // Add other events that the server sends to the client.
}

// ==============================
// CLIENT TO SERVER EVENTS
// ==============================

/**
 * URL and Port of the Websocket Server
 */
export const WEBSOCKET_SERVER_URL = "http://localhost:3001";

/**
 * Drop socket events client side that go above the following frames per second.
 */
export const THROTTELING_MAX_FPS = 30;

/**
 * Exclude Client-Side Socket Events from throttling (and beeing dropped) by the client if the event starts with the following string from `ClientToServerEvents`.
 */
export const THROTTELING_EXCLUDE = "action:";

/**
 * Interface representing the events sent from the client to the server.
 */
export interface ClientToServerEvents {
  "corners:change": (data: Corners) => void;
  // Excluded from throttle
  "action:someAction": (payload: unknown) => void;
}
