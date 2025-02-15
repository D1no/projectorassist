import type { Server, Socket } from "socket_io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "#types/networkSocketEvents.ts";

import {
  ProjectionBackgroundColor,
  ProjectionOrientation,
  ProjectionVisible,
} from "#types/projectionTypes.ts";
import { DB } from "../model/db_json.ts";

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
  socket.emit(
    "action:projection:background:update",
    DB.projection.backgroundColor,
  );

  // Immediately send the current projector orientation to the new client.
  socket.emit(
    "action:projection:orientation:update",
    DB.projection.orientation,
  );

  // Immediately send the current projection visibility to the new client.
  socket.emit(
    "action:projection:visible:update",
    DB.projection.visible,
  );

  // Listen for projection background change events.
  socket.on(
    "action:projection:background:change",
    (color: ProjectionBackgroundColor) => {
      // Update the in-memory state.
      DB.projection.backgroundColor = color;

      // Broadcast updated state to all clients.
      io.emit(
        "action:projection:background:update",
        DB.projection.backgroundColor,
      );
      console.log(
        "Projection background updated:",
        DB.projection.backgroundColor,
      );
    },
  );

  // Listen for projector orientation change events.
  socket.on(
    "action:projection:orientation:change",
    (orientation: ProjectionOrientation) => {
      // Update the in-memory state.
      DB.projection.orientation = orientation;

      // Broadcast updated state to all clients.
      io.emit(
        "action:projection:orientation:update",
        DB.projection.orientation,
      );
      console.log(
        "Projector orientation updated:",
        DB.projection.orientation,
      );
    },
  );

  // Listen for projector visibility change events.
  socket.on(
    "action:projection:visible:change",
    (visible: ProjectionVisible) => {
      // Update the in-memory state.
      DB.projection.visible = visible;

      // Broadcast updated state to all clients.
      io.emit(
        "action:projection:visible:update",
        DB.projection.visible,
      );
      console.log(
        "Projector visibility updated:",
        DB.projection.visible,
      );
    },
  );
}
