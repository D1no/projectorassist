import { io } from "socket.io-client";

// TODO: Replace with your server's URL
export const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});
