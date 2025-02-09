import type { Server, Socket } from "socket_io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "#types/networkSocketEvents.ts";

import type { CornersViewportCoordinates } from "#types/cornerTypes.ts";
import { DB } from "../model/db_json.ts";

/**
 * Register event handlers for corner functionality.
 *
 * @param socket - The socket for the connected client.
 * @param io - The server instance.
 */
export function registerCornerHandlers(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  io: Server<ClientToServerEvents, ServerToClientEvents>,
) {
  // Immediately send the current corners state to the new client.
  socket.emit("corners:update", DB.corners);

  // Listen for corner change events.
  socket.on("corners:change", (newCorners: CornersViewportCoordinates) => {
    // Update the in-memory state.
    DB.corners = { ...newCorners };

    // Broadcast updated state to all clients.
    io.emit("corners:update", DB.corners);
    console.log("Corners updated.");
  });
}
