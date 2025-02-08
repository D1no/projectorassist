import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import type { Corners } from "#types/cornerTypes.ts";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  WEBSOCKET_PORT,
} from "#types/networkSocketEvents.ts";

// TODO: Save to disk debounced by 4 seconds.
/**
 * In-memory corners state shared among all connections.
 * Adjust the default values to whatever you prefer.
 */
let cornersState: Corners = {
  topLeft: { x: 30, y: 5 },
  topRight: { x: 90, y: 5 },
  bottomRight: { x: 90, y: 95 },
  bottomLeft: { x: 30, y: 95 },
};

// Create the Socket.IO server
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    // TODO: DO NOT USE "*" IN PRODUCTION
    origin: "*",
  },
});

// When a client connects
io.on(
  "connection",
  (socket) => {
    console.log(`socket ${socket.id} connected`);

    // Immediately send the current corners to this new client
    socket.emit("corners:update", cornersState);

    // Listen for corner changes from a "controller" UI
    socket.on("corners:change", (newCorners: Corners) => {
      // Update our in-memory corners state
      cornersState = { ...newCorners };
      // Broadcast updated corners to all connected clients
      io.emit("corners:update", cornersState);
      console.log("Corners updated:", cornersState);
    });

    // When a client disconnects
    socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  },
);

console.log(`Starting Socket.IO server on port ${WEBSOCKET_PORT}...`);

// Start the HTTP server that Socket.IO attaches to
Deno.serve({
  handler: io.handler(),
  port: WEBSOCKET_PORT,
});
