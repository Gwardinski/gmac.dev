import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import figlet from "figlet";
import { Server as SocketIOServer } from "socket.io";
import { CORS_ORIGINS } from "../env.js";
import { noteRouter } from "./_note/router.note.js";
import { pewRouter } from "./pew/router.pew.js";
import { initPewGame } from "./pew/service.pew.js";

const ELYSIA_PORT = 3001;
const SOCKET_IO_PORT = 3002;

export function initServer() {
  console.log(`bun bun bun, it rhymes with fun!`);

  // Elysia REST API
  const app = initAPI();

  // Socket.IO Websockets
  const io = initWebsockets();

  console.log(
    `gmac.api (REST) running: ${app.server?.hostname}:${app.server?.port}`
  );
  console.log(`Socket.IO running on port ${SOCKET_IO_PORT}`);

  return { app, io };
}

function initAPI() {
  // Elysia REST API
  const app = new Elysia()
    .use(
      cors({
        origin: CORS_ORIGINS,
        credentials: true,
      })
    )
    .get("/", () => {
      const body = figlet.textSync("gmac.api");
      return body;
    })
    .use(noteRouter)
    .use(pewRouter)
    .listen(ELYSIA_PORT);

  return app;
}

function initWebsockets() {
  const io = new SocketIOServer(SOCKET_IO_PORT, {
    cors: {
      origin: CORS_ORIGINS,
      credentials: true,
    },
  });
  initPewGame(io);
  return io;
}
