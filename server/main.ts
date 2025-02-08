import { Server } from "socket_io";

import {
  type ClientToServerEvents,
  type ServerToClientEvents,
  WEBSOCKET_PORT,
} from "#types/networkSocketEvents.ts";

import { registerCornerHandlers } from "./controllers/cornerController.ts";

// Create the Socket.IO server
const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    // TODO: DO NOT USE "*" IN PRODUCTION
    origin: "*",
  },
});

// When a client connects
io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  // ==============================
  // Register event controllers
  // ==============================
  registerCornerHandlers(socket, io);

  // ==============================

  // Listen for disconnect event.
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

console.log(`Starting Socket.IO server on port ${WEBSOCKET_PORT}...`);

// Start the HTTP server that Socket.IO attaches to
Deno.serve({
  handler: io.handler(),
  port: WEBSOCKET_PORT,
});
