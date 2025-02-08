import { io, Socket } from "socket.io-client";

import {
  type ClientToServerEvents,
  type ServerToClientEvents,
  THROTTELING_EXCLUDE,
  THROTTELING_MAX_FPS,
  WEBSOCKET_SERVER_URL,
} from "#types/networkSocketEvents.ts";

// Create Socket
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  WEBSOCKET_SERVER_URL,
  {
    transports: ["websocket"],
  },
);

// Throttling: allow non-"excluded" messages at max 30 FPS, otherwise drop message.
const originalEmit = socket.emit.bind(socket);
let lastEmitTime = 0;

const throttledEmit: typeof socket.emit = <
  Ev extends keyof ClientToServerEvents,
  Args extends Parameters<ClientToServerEvents[Ev]>,
>(
  event: Ev,
  ...args: Args
) => {
  if (event.startsWith(THROTTELING_EXCLUDE)) {
    return originalEmit(event, ...args);
  }
  const now = performance.now();
  if (now - lastEmitTime >= 1000 / THROTTELING_MAX_FPS) {
    lastEmitTime = now;
    return originalEmit(event, ...args);
  }
  return socket;
};

socket.emit = throttledEmit;

export default socket;
