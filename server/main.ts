// main.ts
import { Server } from "socket_io";
import { loadDB } from "./model/db_json.ts";
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
  WEBSOCKET_PORT,
} from "#types/networkSocketEvents.ts";

import { registerCornerHandlers } from "./controllers/cornerController.ts";
import { registerProjectionHandlers } from "./controllers/projectionController.ts";
import { registerSlideHandler } from "./controllers/slideController.ts";

async function main() {
  // Wait for our data store to be loaded so it is ready for our handlers.
  await loadDB();

  // Now that the store is loaded, we can safely initialize our server.
  const io = new Server<ClientToServerEvents, ServerToClientEvents>({
    cors: {
      // TODO: DO NOT USE "*" IN PRODUCTION
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);

    // Register event controllers.
    registerCornerHandlers(socket, io);
    registerProjectionHandlers(socket, io);
    registerSlideHandler(socket, io);

    socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  });

  console.log(`Starting Socket.IO server on port ${WEBSOCKET_PORT}...`);

  // Start the HTTP server that Socket.IO attaches to.
  Deno.serve({
    handler: io.handler(),
    port: WEBSOCKET_PORT,
  });
}

main();
