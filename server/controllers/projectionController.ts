import type { Server, Socket } from "socket_io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "#types/networkSocketEvents.ts";

import {
  ProjectionBackgroundColor,
  ProjectionOrientation,
} from "#types/projectionTypes.ts";

// In-memory state for projection background color.
let projectionBackgroundColor = ProjectionBackgroundColor.Invisible;
let projectorOrientation = ProjectionOrientation.Portrait;

/**
 * Register event handlers for projection background functionality.
 *
 * @param socket - The socket for the connected client.
 * @param io - The server instance.
 */
export function registerProjectionHandlers(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  io: Server<ClientToServerEvents, ServerToClientEvents>,
) {
  // Immediately send the current projection background color to the new client.
  socket.emit("action:projection:background:update", projectionBackgroundColor);
  // Immediately send the current projector orientation to the new client.
  socket.emit("action:projection:orientation:update", projectorOrientation);

  // Listen for projection background change events.
  socket.on(
    "action:projection:background:change",
    (color: ProjectionBackgroundColor) => {
      // Update the in-memory state.
      projectionBackgroundColor = color;

      // Broadcast updated state to all clients.
      io.emit("action:projection:background:update", projectionBackgroundColor);
      console.log("Projection background updated:", projectionBackgroundColor);
    },
  );

  // Listen for projector orientation change events.
  socket.on(
    "action:projection:orientation:change",
    (orientation: ProjectionOrientation) => {
      // Update the in-memory state.
      projectorOrientation = orientation;

      // Broadcast updated state to all clients.
      io.emit("action:projection:orientation:update", projectorOrientation);
      console.log("Projector orientation updated:", projectorOrientation);
    },
  );
}
