import type { Server, Socket } from "socket_io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "#types/networkSocketEvents.ts";

import { DB } from "../model/db_json.ts";

/**
 * Register event handlers for corner functionality.
 *
 * @param socket - The socket for the connected client.
 * @param io - The server instance.
 */
export function registerSlideHandler(
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  io: Server<ClientToServerEvents, ServerToClientEvents>,
) {
  // Immediately send the current corners state to the new client.
  socket.emit("action:slides:currentSlide:update", DB.slides.currentSlide);

  // Listen for corner change events.
  socket.on("action:slides:currentSlide:change", (slide: number) => {
    // TODO: Maybe add some validation here to make sure the slide is within
    // the bounds of the presentation.

    // Update the in-memory state.
    DB.slides.currentSlide = slide;

    // Broadcast updated state to all clients.
    io.emit("action:slides:currentSlide:update", DB.slides.currentSlide);
    console.log("Slide changed to Nr.:", DB.slides.currentSlide);
  });
}
