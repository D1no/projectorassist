import type { Server, Socket } from "socket_io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "#types/networkSocketEvents.ts";

import type { CornersViewportCoordinates } from "#types/cornerTypes.ts";

// In-memory state for corners.
let cornersState: CornersViewportCoordinates = {
  topLeft: { x: 30, y: 5 },
  topRight: { x: 90, y: 5 },
  bottomRight: { x: 90, y: 95 },
  bottomLeft: { x: 30, y: 95 },
};

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
  socket.emit("corners:update", cornersState);

  // Listen for corner change events.
  socket.on("corners:change", (newCorners: CornersViewportCoordinates) => {
    // Update the in-memory state.
    cornersState = { ...newCorners };

    // Broadcast updated state to all clients.
    io.emit("corners:update", cornersState);
    console.log("Corners updated:", cornersState);
  });
}
