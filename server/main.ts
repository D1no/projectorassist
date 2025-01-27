import { Server } from "https://deno.land/x/socket_io@0.2.1/mod.ts";
import { phrase } from "#lib/hello.ts";

console.log(phrase);

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("hello", "world");

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

Deno.serve({
  handler: io.handler(),
  port: 3001,
});
